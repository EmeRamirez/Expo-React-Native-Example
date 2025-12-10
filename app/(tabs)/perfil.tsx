import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
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
        onPress={() => { 
          logout();
          router.replace("/login");
        }}
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