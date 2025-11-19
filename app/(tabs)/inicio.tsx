// app/(tabs)/inicio.tsx
import CustomHeader from "@/components/layout/CustomHeader";
import ToDoList from "@/components/ToDoList";
import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InicioScreen() {

  const [tasks, setTasks] = useState([]);  
  
  useFocusEffect(
    useCallback(()=>{
      const loadTasks = async () => {
        const file = new File(Paths.cache, 'tareas.json')
        try{
          const exists = file.exists
          if(!exists){
            setTasks([]);
            return;
          }
          const fileContent = file.textSync();
          const parsed = fileContent ? JSON.parse(fileContent) : [];
          setTasks(parsed)
        } catch(err) {
            console.log("Error cargando tareas:", err);
            setTasks([]);
        }
      };
      loadTasks();
    }, [])

  );
  
  
  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Mis tareas" 
        showBackButton={false}
      />
      
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        <Text style={styles.welcomeSubtitle}>
          Esta es tu pantalla principal de la aplicación
        </Text>

        <View style={styles.borderBottomContainer}>
          <Button 
            title="Añadir una tarea" 
            onPress={() => router.push("/add_task")} 
            variant="primary"
            startIcon={
              <Ionicons 
                name="add-circle-outline" 
                size={20} 
                color="#ffffffff" 
              />
            }
            fullWidth
          />
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Mis Tareas</Text>
          <View style={styles.tasksContainer}>
            {tasks.length > 0 ? <ToDoList tasks={ tasks} /> : <Text>Que vacío está esto, agrega una tarea para empezar.</Text>}
          </View>
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
    paddingHorizontal: 24,
    marginTop: 32,
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
  borderBottomContainer: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  tasksSection: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
  },
});