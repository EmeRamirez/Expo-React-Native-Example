// app/(tabs)/inicio.tsx
import { View, Text, StyleSheet } from "react-native";
import CustomHeader from "@/components/layout/CustomHeader";
import Button from "@/components/ui/Button";

export default function InicioScreen() {

  const handleAction = (num: number) => {
    if (num === 1) {
      console.log("Acción principal realizada");
    } else {
      console.log("Wena cabros");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Inicio" 
        showBackButton={false}
      />
      
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        <Text style={styles.welcomeSubtitle}>
          Esta es tu pantalla principal de la aplicación
        </Text>
        
        <View style={styles.actionsContainer}>
          <Button 
            title="Acción Principal" 
            onPress={() => handleAction(1)} 
            variant="primary" 
          />
          
          <Button 
            title="Acción Secundaria" 
            onPress={() => handleAction(2)} 
            variant="secondary" 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
});