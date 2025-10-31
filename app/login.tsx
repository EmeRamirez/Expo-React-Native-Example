// app/login.tsx
import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import CustomHeader from "@/components/layout/CustomHeader";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // Validación básica
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Login exitoso - navegar a inicio
        router.replace("/(tabs)/inicio");
        
        // Limpiar formulario
        setEmail("");
        setPassword("");
        
        Alert.alert("Éxito", result.message);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Esta funcionalidad estará disponible pronto");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomHeader 
        title="Iniciar Sesión" 
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Título y descripción */}
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </View>

            {/* Olvidé mi contraseña */}
            <Button 
              title="¿Olvidaste tu contraseña?"
              onPress={handleForgotPassword}
              variant="secondary"
              style={styles.forgotPasswordButton}
              textStyle={styles.forgotPasswordText}
            />

            {/* Botón de Login */}
            <Button 
              title={isLoggingIn ? "Iniciando sesión..." : "Iniciar Sesión"}
              onPress={handleLogin}
              variant="primary"
              disabled={isLoggingIn}
              style={[
                styles.loginButton,
                isLoggingIn && styles.loginButtonDisabled
              ]}
            />

       
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  forgotPasswordButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  demoInfo: {
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  demoInfoText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
  },
});