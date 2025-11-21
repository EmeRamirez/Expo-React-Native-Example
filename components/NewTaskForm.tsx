import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types/tasks";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { launchCameraAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Se crean las props si es necesario en el futuro
interface NewTaskFormProps {
    onBack?: () => void;
    onSave: (newTask: Task) => void;
}

export default function NewTaskForm({ onBack, onSave }: NewTaskFormProps) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    const handleGeneratePhoto = async () => {
        if (isCapturingPhoto) return;

        try {
            setIsCapturingPhoto(true);

            // Lógica para abrir la cámara y capturar foto
            const {status} = await requestCameraPermissionsAsync();

            if (status !== 'granted') {
                alert('Permiso para usar la cámara denegado');
                setIsCapturingPhoto(false);
                return;
            }

            const result = await launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets.length > 0) {
                setPhoto(result.assets[0].uri);
            }  
            
            
        } catch (error) {
            console.error("Error al capturar foto:", error);
            setIsCapturingPhoto(false);
        } finally {
            setIsCapturingPhoto(false);
        }
    };

    const handleSaveTask = () => {
        if (isSaving) return;

        try {
            setIsSaving(true);
            // En este punto se podrían agregar validaciones adicionales

            // Se obtiene la ubicación (expo-location)

            // Lógica para guardar la tarea
            const newTask: Task = {
                id: Date.now().toString(),
                userId: user?.id || 0,
                title,
                description,
                completed: false,
                creationDate: new Date(),
                imgUrl: photo || undefined,
                location: location || undefined,
                priority,
            };
            // Guardar la tarea en el almacenamiento (AsyncStorage)
            onSave(newTask);
        } finally {
            setIsSaving(false);
        }
    };

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
                        <Text style={styles.label}>Titulo de la tarea</Text>
                        <TextInput 
                            value={title} 
                            onChangeText={setTitle} 
                            style={styles.input} 
                            placeholder="Ingresa el título"
                        />
                        
                        <Text style={{...styles.label, marginTop: 16}}>Descripción de la tarea</Text>
                        <TextInput 
                            value={description} 
                            onChangeText={setDescription} 
                            style={styles.input} 
                            placeholder="Ingresa la descripción"
                            multiline
                        />

                        {/* Selector de prioridad */}
                        <Text style={{...styles.label, marginTop: 16}}>Prioridad</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                mode="dropdown"
                                selectedValue={priority}
                                onValueChange={(itemValue) => setPriority(itemValue)}
                            >
                                <Picker.Item label="Baja" value="low" color="#153f5aff"/>
                                <Picker.Item label="Media" value="medium" color="#72b711ff" />
                                <Picker.Item label="Alta" value="high" color="#e72d2dff" />
                            </Picker>
                        </View>

                        <View style={styles.photoContainer}>
                            {photo ? (
                                <View>
                                    <Image source={{ uri: photo }} style={styles.photo} />
                                </View>
                            ) : (
                                <View style={styles.emptyPhotoContainer}>
                                    <Ionicons name="camera-outline" size={54} color="#66666676" />
                                </View>
                            )}
                            
                            <Button 
                                title="Agregar foto"
                                startIcon={<Ionicons name="camera" size={20} color="#ffffffff" />}
                                variant="primary"
                                onPress={handleGeneratePhoto}
                                style={{ marginTop: 16, width: 200 }}
                            />
                            
                            <Button
                                title="Guardar tarea"
                                startIcon={<Ionicons name="save" size={20} color="#ffffffff" />}
                                onPress={() => { handleSaveTask(); }}
                                variant="secondary"
                                style={{ marginTop: 10, width: 200 }}
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
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 16,
        paddingBottom: 32, // Espacio extra al final para scroll
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    pickerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 40, // Espacio adicional para asegurar que todo sea visible
    },
    emptyPhotoContainer: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },  
    photo: {
        height: 150,
        width: 150,
        borderRadius: 8,
        marginBottom: 24,
    },
});