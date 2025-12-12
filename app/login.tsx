// app/login.tsx
import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/services/hooks/auth/useLogin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { mutate: login, isPending, error, data } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

   // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/inicio");
    }
  }, [isAuthenticated]);

  // Mostrar error del hook
  useEffect(() => {
    if (error) {
      setFormError(error.message);
    } else {
      setFormError(null);
    }
  }, [error]);

  const handleLogin = async () => {
    // Validación básica
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor, ingresa un email válido");
      return;
    }

    // Limpiar errores anteriores
    setFormError(null);

    // Ejecutar login
    login({ email, password }, {
      onSuccess: () => {
        // Limpiar formulario
        setEmail("");
        setPassword("");
      }
    });
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar contraseña", "Esta funcionalidad estará disponible pronto");
  };

   // Si está cargando la autenticación inicial, mostrar loading
  if (authLoading) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Iniciar Sesión" 
          showBackButton={true}
        />
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
                  editable={!isPending}
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
                  editable={!isPending}
                />
              </View>

              {/* Mostrar error si existe */}
              {formError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              )}

              {/* Olvidé mi contraseña */}
              <Button 
                title="¿Olvidaste tu contraseña?"
                onPress={handleForgotPassword}
                variant="secondary"
                style={styles.forgotPasswordButton}
                textStyle={styles.forgotPasswordText}
                disabled={isPending}
              />

              {/* Botón de Login */}
              <Button 
                title={isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                onPress={handleLogin}
                variant="primary"
                disabled={isPending || !email.trim() || !password.trim()}
                style={[
                  styles.loginButton,
                  (isPending || !email.trim() || !password.trim()) && styles.loginButtonDisabled
                ]}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
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