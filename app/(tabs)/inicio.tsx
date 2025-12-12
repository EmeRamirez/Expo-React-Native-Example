// app/(tabs)/inicio.tsx
import CustomHeader from "@/components/layout/CustomHeader";
import NewTaskForm from "@/components/NewTaskForm";
import ToDoList from "@/components/ToDoList";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useGetTodos } from "@/services/hooks/todos/useGetTodos";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function InicioScreen() {
  const { user } = useAuth();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Usar el hook de TanStack Query para obtener los TODOS
  const { 
    data: todosResponse, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetTodos();

  console.log(todosResponse);

  // Extraer los datos del response
  const userTasks = todosResponse?.data || [];
  const taskCount = todosResponse?.count || 0;

  // Manejar refresh
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Si está creando una tarea, mostrar el componente del formulario
  if (isCreatingTask) {
    return (
      <NewTaskForm 
        onBack={() => setIsCreatingTask(false)} 
        onSave={() => {
          setIsCreatingTask(false);
          refetch(); // Refrescar lista después de crear
        }}
      />
    );
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Mis tareas" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando tus tareas...</Text>
        </View>
      </View>
    );
  }

  // Mostrar error si hay problema
  if (isError) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Mis tareas" showBackButton={false} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>Error al cargar tareas</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'No se pudieron cargar tus tareas'}
          </Text>
          <Button 
            title="Reintentar" 
            onPress={() => refetch()}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Mis tareas" showBackButton={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
            <Text style={styles.welcomeSubtitle}>
              Esta es tu pantalla principal de la aplicación
            </Text>
          </View>

          <View style={styles.borderBottomContainer}>
            <Button 
              title="Añadir una tarea" 
              onPress={() => setIsCreatingTask(true)} 
              variant="primary"
              startIcon={
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              }
              fullWidth
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskCount}</Text>
              <Text style={styles.statLabel}>Total tareas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {userTasks.filter(task => task.completed).length}
              </Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {userTasks.filter(task => !task.completed).length}
              </Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
          </View>

          <View style={styles.tasksSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Tareas</Text>
              {taskCount > 0 && (
                <Button 
                  title="Refrescar"
                  onPress={() => refetch()}
                  variant="secondary"
                  style={styles.refreshButton}
                  textStyle={styles.refreshButtonText}
                />
              )}
            </View>
            
            <View style={styles.tasksContainer}>
              {taskCount === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="checkbox-outline" size={64} color="#C7C7CC" />
                  <Text style={styles.emptyStateTitle}>No hay tareas</Text>
                  <Text style={styles.emptyStateText}>
                    Añade tu primera tarea para comenzar
                  </Text>
                  <Button 
                    title="Crear tarea"
                    onPress={() => setIsCreatingTask(true)}
                    variant="primary"
                    style={styles.emptyStateButton}
                  />
                </View>
              ) : (
                <ToDoList tasks={userTasks} 
                // onTaskUpdated={refetch} // Descomentar si quieres refrescar al actualizar (Se debe añadir al componente ToDoList)
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeContainer: {
    marginBottom: 32,
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
    lineHeight: 22,
  },
  borderBottomContainer: {
    width: '100%',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tasksSection: {
    flex: 1,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  refreshButtonText: {
    fontSize: 14,
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  emptyStateButton: {
    minWidth: 150,
  },
});