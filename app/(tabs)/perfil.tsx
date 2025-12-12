import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { queryClient } from "@/services/api/queryClient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 1. Cancelar TODAS las queries pendientes primero
      await queryClient.cancelQueries();
      
      // 2. Ejecutar logout (limpia AsyncStorage)
      await logout();
      
      // 3. Limpiar caché COMPLETA de TanStack Query
      queryClient.clear();
      
      // 4. Pequeño delay para asegurar que todo se limpió
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 5. Redirigir a login
      router.replace("/login");
      
    } catch (error) {
      console.error('Error en logout:', error);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom header */}
      <CustomHeader title="Perfil" showBackButton={true} />

      <View style={styles.content}>
        <Text>Pantalla de perfil</Text>
        <Text>Bienvenido {user?.email}</Text>
      </View>

      <Button 
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="primary"
        startIcon={
          <Ionicons 
            name="log-out-outline" 
            size={20} 
            color="#ffffffff" 
          />
        
        }
        style={{ marginHorizontal: 60, marginBottom: 20 }}
      />
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});