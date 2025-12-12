// app/(tabs)/inicio.tsx
import CustomHeader from "@/components/layout/CustomHeader";
import NewTaskForm from "@/components/NewTaskForm";
import ToDoList from "@/components/ToDoList";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
// import { mockTasks } from "@/data/mockTasks";
import { Todo } from "@/types/todos";
import { getTasksFromStorage, saveTasksToStorage } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InicioScreen() {
  const { user } = useAuth();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userTasks, setUserTasks] = useState<Todo[]>([]);

  // Se filtran las tareas del usuario actual desde AsyncStorage
  useEffect(() => {
    getTasksFromStorage().then((allTasks) => {
      if (user) {
        const filteredTasks = allTasks.filter(task => task.userId === user.id);
        setUserTasks(filteredTasks);
      } else {
        setUserTasks([]);
      }
    });
  }, [user]);

  const handleSaveToStorage = async (newTask: Todo) => {
    console.log(newTask);
    // Se añade la nueva tarea a la lista de tareas del usuario
    const allTasks = await getTasksFromStorage();
    const res = await saveTasksToStorage([...allTasks, newTask]);
    
    if (!res) {
      alert("Error al guardar la tarea");
    } else {
      setIsCreatingTask(false);
    }
  }

  // Si está creando una tarea, mostrar el componente del formulario
  if (isCreatingTask) {
    return (
      <NewTaskForm onBack={() => setIsCreatingTask(false)} onSave={handleSaveToStorage}/>
    );
  }

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
            onPress={() => { setIsCreatingTask(true); }} 
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
            {userTasks.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#8E8E93' }}>
                No tienes tareas creadas aún. Añade una nueva tarea para comenzar.
              </Text>
            ): (
              <ToDoList tasks={userTasks} />
            )}
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
    marginBottom: 7,
    textAlign: 'center',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
  },
});