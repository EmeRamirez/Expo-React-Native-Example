import { Text, View, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const ipssLogo = require("../assets/images/ipss-logo.png");

export default function Index() {
  const router = useRouter();

  const handleNavigate = () => {
    // router.push('/inicio');
    router.push('/login');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <View
        style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 100,
      }}>
        <Image
          source={ipssLogo}
          style={{ width: 200, height: 40, marginBottom: 20 }}
        />
        <Text>Evaluación 1</Text>
        <Text>Desarrollo de Aplicaciones Móviles - IPSS 2025</Text>
        {/* Insertar imagen */}
        

        <Pressable
          onPress={handleNavigate}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Loguear a la pantalla de inicio</Text>
        </Pressable>
      </View>
      
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text style={{ marginBottom: 20, color: "#888" }}>
          © 2025 Desarrollado por grupo Compila o Lloro
        </Text>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 60,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});