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
      // 1. Esperar a que logout termine
      await logout();
      
      // 2. Limpiar caché de TanStack Query (IMPORTANTE)
      queryClient.clear();
      
      // 3. Ahora sí navegar
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