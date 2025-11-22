// components/layout/CustomHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function CustomHeader({ 
  title = "Título", 
  showBackButton = true,
  onBack 
}: CustomHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <>
    {/* íconos oscuros habilitados en el menú superior */}
    <StatusBar barStyle="dark-content" />
    
    <SafeAreaView  style={styles.header} edges={['top']} >
      {showBackButton && (
        <Pressable 
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Atrás</Text>
        </Pressable>
      )}
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      {/* Espacio para balancear el diseño cuando hay botón de volver */}
      {showBackButton && <View style={styles.placeholder} />}
    </SafeAreaView>
  
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
      paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 80,
  },
});