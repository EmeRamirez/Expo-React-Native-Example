// components/NewTaskForm.tsx
import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUploadImage } from "@/services/hooks/images/useUploadImage";
import { useCreateTodo } from "@/services/hooks/todos/useCreateTodo";
import { CreateTodoRequest } from "@/types/todos";
import { Ionicons } from "@expo/vector-icons";
import { launchCameraAsync, MediaTypeOptions, requestCameraPermissionsAsync } from 'expo-image-picker';
import { getCurrentPositionAsync, getForegroundPermissionsAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Props actualizadas
interface NewTaskFormProps {
    onBack?: () => void;
    onSave?: () => void; // Opcional, para refrescar lista después de crear
}

export default function NewTaskForm({ onBack, onSave }: NewTaskFormProps) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // Hooks para las mutaciones
    const { mutateAsync: createTodo, isPending: isCreatingTodo } = useCreateTodo();
    const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadImage();

    const handleTakePhoto = async () => {
        try {
            // Solicitar permisos de cámara
            const { status } = await requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita permiso para usar la cámara');
                return;
            }

            // Abrir cámara
            const result = await launchCameraAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                setPhotoUri(imageUri);
                
                // Subir imagen inmediatamente o esperar a guardar la tarea?
                // Por ahora solo guardamos la URI local
                console.log('Foto capturada:', imageUri);
            }
        } catch (error) {
            console.error("Error al capturar foto:", error);
            Alert.alert('Error', 'No se pudo capturar la foto');
        }
    };

    const handleUploadPhoto = async (): Promise<string | null> => {
        if (!photoUri) {
            Alert.alert('Error', 'Primero debes tomar una foto');
            return null;
        }

        try {
            const response = await uploadImage({ uri: photoUri });
            
            // La respuesta debería contener la URL pública de Cloudflare R2
            const imageUrl = response.data.url;
            setUploadedImageUrl(imageUrl);
            
            Alert.alert('Éxito', 'Imagen subida correctamente');
            return imageUrl;
        } catch (error: any) {
            console.error('Error subiendo imagen:', error);
            Alert.alert('Error', error.message || 'No se pudo subir la imagen');
            return null;
        }
    };

    const handleRemovePhoto = () => {
        Alert.alert(
            'Eliminar foto',
            '¿Estás seguro de eliminar esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => {
                        setPhotoUri(null);
                        setUploadedImageUrl(null);
                    }
                },
            ]
        );
    };

    const handleGetLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
        try {
            setIsFetchingLocation(true);

            const { status } = await getForegroundPermissionsAsync();

            if (status !== 'granted') {
                const { status: reqStatus } = await requestForegroundPermissionsAsync();
                if (reqStatus !== 'granted') {
                    Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
                    return null;
                }
            }

            const location = await getCurrentPositionAsync({});
            const locationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            
            setLocation(locationData);
            return locationData;
        } catch (error) {
            console.error("Error al obtener ubicación:", error);
            Alert.alert('Error', 'No se pudo obtener la ubicación');
            return null;
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const handleSaveTask = async () => {
        if (isSaving || isCreatingTodo) return;

        // Validaciones
        if (!title.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'Debes estar autenticado');
            return;
        }

        try {
            setIsSaving(true);

            // 1. Obtener ubicación (opcional)
            let taskLocation = location;
            if (!taskLocation) {
                taskLocation = await handleGetLocation();
            }

            // 2. Subir foto si existe (opcional)
            let finalPhotoUrl = uploadedImageUrl;
            if (photoUri && !uploadedImageUrl) {
                finalPhotoUrl = await handleUploadPhoto();
            }

            // 3. Preparar datos para crear la tarea
            const todoData: CreateTodoRequest = {
                title: title.trim(),
                completed: false,
                ...(taskLocation && { location: taskLocation }),
                ...(finalPhotoUrl && { photoUri: finalPhotoUrl }),
            };

            // 4. Crear la tarea
            await createTodo(todoData, {
                onSuccess: () => {
                    Alert.alert('Éxito', 'Tarea creada correctamente');
                    
                    // Limpiar formulario
                    setTitle("");
                    setPhotoUri(null);
                    setUploadedImageUrl(null);
                    setLocation(null);
                    
                    // Llamar callback si existe
                    if (onBack) onBack();
                    if (onSave) onSave();
                },
                onError: (error) => {
                    Alert.alert('Error', error.message || 'No se pudo crear la tarea');
                },
            });

        } catch (error: any) {
            console.error("Error al guardar tarea:", error);
            Alert.alert('Error', error.message || 'Ocurrió un error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    // Estado combinado para botones
    const isLoading = isSaving || isCreatingTodo || isUploadingImage;

    return (
        <View style={styles.container}>
            <CustomHeader 
                title="Crear Tarea" 
                showBackButton={true}
                onBack={onBack ? onBack : undefined}
            />
            
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        {/* Título de la tarea */}
                        <Text style={styles.label}>Título de la tarea *</Text>
                        <TextInput 
                            value={title} 
                            onChangeText={setTitle} 
                            style={styles.input} 
                            placeholder="Ingresa el título"
                            editable={!isLoading}
                        />
                        
                        {/* Sección de foto */}
                        <View style={styles.photoSection}>
                            <Text style={styles.label}>Foto (opcional)</Text>
                            
                            {photoUri ? (
                                <View style={styles.photoContainer}>
                                    <Image 
                                        source={{ uri: photoUri }} 
                                        style={styles.photo} 
                                    />
                                    
                                    <View style={styles.photoActions}>
                                        <Button 
                                            title={isUploadingImage ? "Subiendo..." : uploadedImageUrl ? "Subida ✓" : "Subir foto"}
                                            onPress={handleUploadPhoto}
                                            variant="secondary"
                                            disabled={isUploadingImage || !!uploadedImageUrl}
                                            startIcon={
                                                isUploadingImage ? (
                                                    <ActivityIndicator size="small" color="#007AFF" />
                                                ) : uploadedImageUrl ? (
                                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                                ) : (
                                                    <Ionicons name="cloud-upload" size={20} color="#007AFF" />
                                                )
                                            }
                                            style={styles.photoButton}
                                        />
                                        
                                        <Button 
                                            title=""
                                            onPress={handleRemovePhoto}
                                            variant="secondary"
                                            startIcon={<Ionicons name="trash-outline" size={20} color="#FF3B30" />}
                                            style={[styles.photoButton, styles.deleteButton]}
                                        />
                                    </View>
                                    
                                    {uploadedImageUrl && (
                                        <Text style={styles.uploadSuccess}>
                                            ✓ Imagen subida a Cloudflare
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.emptyPhotoContainer}>
                                    <Ionicons name="camera-outline" size={54} color="#66666676" />
                                    <Text style={styles.emptyPhotoText}>
                                        Toca el botón para tomar una foto
                                    </Text>
                                </View>
                            )}
                            
                            <Button 
                                title="Tomar foto"
                                startIcon={<Ionicons name="camera" size={20} color="#FFFFFF" />}
                                variant="primary"
                                onPress={handleTakePhoto}
                                disabled={isLoading}
                                style={styles.takePhotoButton}
                            />
                        </View>

                        {/* Ubicación */}
                        <View style={styles.locationSection}>
                            <Text style={styles.label}>Ubicación (opcional)</Text>
                            
                            {location ? (
                                <View style={styles.locationInfo}>
                                    <Ionicons name="location" size={20} color="#4CAF50" />
                                    <Text style={styles.locationText}>
                                        Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.noLocationText}>
                                    No se ha obtenido ubicación
                                </Text>
                            )}
                            
                            <Button 
                                title={isFetchingLocation ? "Obteniendo..." : "Obtener ubicación actual"}
                                onPress={handleGetLocation}
                                variant="secondary"
                                disabled={isFetchingLocation || isLoading}
                                startIcon={
                                    isFetchingLocation ? (
                                        <ActivityIndicator size="small" color="#007AFF" />
                                    ) : (
                                        <Ionicons name="locate" size={20} color="#007AFF" />
                                    )
                                }
                                style={styles.locationButton}
                            />
                        </View>

                        {/* Botón de guardar */}
                        <View style={styles.saveSection}>
                            <Button 
                                title={isLoading ? "Guardando..." : "Guardar tarea"}
                                onPress={handleSaveTask}
                                variant="primary"
                                disabled={isLoading || !title.trim()}
                                startIcon={
                                    isLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Ionicons name="save" size={20} color="#FFFFFF" />
                                    )
                                }
                                style={styles.saveButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000000',
    },
    input: {
        height: 48,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F8F8F8',
        fontSize: 16,
        color: '#000000',
        marginBottom: 24,
    },
    photoSection: {
        marginBottom: 24,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    photo: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    photoActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    photoButton: {
        minWidth: 120,
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        borderColor: '#FFCDD2',
    },
    uploadSuccess: {
        fontSize: 12,
        color: '#4CAF50',
        textAlign: 'center',
    },
    emptyPhotoContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    emptyPhotoText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 8,
        textAlign: 'center',
    },
    takePhotoButton: {
        alignSelf: 'center',
        minWidth: 200,
    },
    locationSection: {
        marginBottom: 32,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 8,
    },
    noLocationText: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    locationButton: {
        alignSelf: 'flex-start',
    },
    saveSection: {
        marginTop: 'auto',
    },
    saveButton: {
        marginTop: 16,
    },
});