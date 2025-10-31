import { View, Text, Pressable, StyleSheet } from "react-native";
import CustomHeader from "@/components/layout/CustomHeader";
import { useAuth } from "@/context/AuthContext";

export default function PerfilScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Custom header */}
      <CustomHeader title="Perfil" showBackButton={true} />

      <View style={styles.content}>
        <Text>Pantalla de perfil</Text>
        <Text>Bienvenido {user?.name}</Text>
      </View>
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