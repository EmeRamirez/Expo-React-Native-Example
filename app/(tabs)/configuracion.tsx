import { View, Text, Pressable, StyleSheet } from "react-native";
import CustomHeader from "@/components/layout/CustomHeader";

export default function ConfiguracionScreen() {

  return (
    <View style={styles.container}>
      {/* Custom header */}
      <CustomHeader title="Configuración" showBackButton={true} />

      <View style={styles.content}>
        <Text>Pantalla de configuración</Text>
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