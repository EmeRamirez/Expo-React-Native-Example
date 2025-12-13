import { useDeleteTodo } from '@/services/hooks/todos/useDeleteTodo';
import { useToggleTodoStatus } from '@/services/hooks/todos/useToggleTodoStatus';
import { Todo } from '@/types/todos';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Map from './Map';

interface ToDoListProps {
  tasks: Todo[];
  onTaskUpdated?: () => void; // Callback para refrescar la lista
}

export default function ToDoList({ tasks, onTaskUpdated }: ToDoListProps) {
  const [expandedTasks, setExpandedTasks] = useState<{[key: string]: boolean}>({});
  
  // Hooks para las mutaciones
  const deleteMutation = useDeleteTodo();
  const toggleMutation = useToggleTodoStatus();
  
  // Estados para manejar loading individual
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (taskId: string, currentlyCompleted: boolean) => {
    if (togglingId === taskId) return;
    
    setTogglingId(taskId);
    
    try {
      await toggleMutation.mutateAsync({ 
        id: taskId, 
        completed: !currentlyCompleted 
      });
      
      // Notificar al padre si es necesario
      onTaskUpdated?.();
      
      // Mensaje de éxito
      const action = currentlyCompleted ? 'marcada como pendiente' : 'completada';
      console.log(`Tarea ${action}: ${taskId}`);
      
    } catch (error: any) {
      console.error('Error cambiando estado de tarea:', error);
      Alert.alert(
        'Error', 
        error.message || 'No se pudo actualizar el estado de la tarea'
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleShowTaskInfo = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de eliminar "${taskTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => confirmDeleteTask(taskId)
        },
      ]
    );
  };

  const confirmDeleteTask = async (taskId: string) => {
    if (deletingId === taskId) return;
    
    setDeletingId(taskId);
    
    try {
      await deleteMutation.mutateAsync(taskId);
      
      // Notificar al padre para refrescar
      onTaskUpdated?.();
      
      // Mensaje de éxito
      Alert.alert(
        'Tarea eliminada',
        'La tarea ha sido eliminada correctamente.',
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      console.error('Error eliminando tarea:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo eliminar la tarea'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const renderTaskItem = (task: Todo) => {
    const isCompleted = task.completed;
    const isExpanded = expandedTasks[task.id];
    const isBeingDeleted = deletingId === task.id;
    const isBeingToggled = togglingId === task.id;

    return (
      <View 
        key={task.id}
        style={styles.generalContainer}
      >
        <View style={[
          styles.taskItem,
          isCompleted && styles.completedTaskItem
        ]}>
          {/* Radio button para marcar como completada/pendiente */}
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleToggleStatus(task.id, isCompleted)}
            activeOpacity={0.7}
            disabled={isBeingToggled}
          >
            {isBeingToggled ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <View style={styles.radioOuter}>
                {isCompleted && <View style={styles.radioInner} />}
              </View>
            )}
          </TouchableOpacity>

          {/* Contenido de la tarea */}
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              isCompleted && styles.completedText
            ]}>
              {task.title}
            </Text>
            
            {/* Información adicional en línea */}
            <View style={styles.taskMeta}>
              {task.createdAt && (
                <Text style={styles.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString('es-ES')}
                </Text>
              )}
              
              {task.photoUri && (
                <View style={styles.photoIndicator}>
                  <Ionicons name="camera" size={12} color="#666" />
                  <Text style={styles.photoIndicatorText}>Foto</Text>
                </View>
              )}
              
              {task.location && (
                <View style={styles.locationIndicator}>
                  <Ionicons name="location" size={12} color="#666" />
                  <Text style={styles.locationIndicatorText}>Ubicación</Text>
                </View>
              )}
            </View>
          </View>

          {/* Iconos para "Ver más" y "Eliminar" */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => handleShowTaskInfo(task.id)}
              activeOpacity={0.7}
              disabled={isBeingDeleted}
            >
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#007AFF" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(task.id, task.title)}
              activeOpacity={0.7}
              disabled={isBeingDeleted}
            >
              {isBeingDeleted ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Ionicons name="trash" size={24} color="#FF3B30" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido expandido */}
        {isExpanded && (
          <View style={styles.expandedContainer}>
            {/* Foto de la tarea */}
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionTitle}>Foto</Text>
              {task.photoUri ? (
                <Image 
                  source={{ uri: task.photoUri }} 
                  style={styles.taskPhoto} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noDetailContainer}>
                  <Ionicons name="camera-outline" size={32} color="#8E8E93" />
                  <Text style={styles.noDetailText}>
                    No hay foto asociada a esta tarea
                  </Text>
                </View>
              )}
            </View>

            {/* Ubicación de la tarea */}
            <View style={styles.expandedSection}>
              <Text style={styles.expandedSectionTitle}>Ubicación</Text>
              {task.location ? (
                <View style={styles.mapContainer}>
                  <Map 
                    initialLocation={task.location} 
                    onLocationSelect={() => {}} 
                  />
                  <View style={styles.coordinatesContainer}>
                    <Text style={styles.coordinatesText}>
                      Lat: {task.location.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.coordinatesText}>
                      Long: {task.location.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noDetailContainer}>
                  <Ionicons name="location-outline" size={32} color="#8E8E93" />
                  <Text style={styles.noDetailText}>
                    No hay ubicación asociada a esta tarea
                  </Text>
                </View>
              )}
            </View>

            {/* Información adicional */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Creada: {new Date(task.createdAt).toLocaleString('es-ES')}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Actualizada: {new Date(task.updatedAt).toLocaleString('es-ES')}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons 
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={task.completed ? "#34C759" : "#666"} 
                />
                <Text style={styles.infoText}>
                  Estado: {task.completed ? 'Completada' : 'Pendiente'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyStateTitle}>No hay tareas</Text>
          <Text style={styles.emptyStateText}>
            Crea tu primera tarea para comenzar
          </Text>
        </View>
      ) : (
        tasks.map(renderTaskItem)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  generalContainer: { 
    flexDirection: 'column', 
    borderBottomColor: '#E5E5EA', 
    borderBottomWidth: 1, 
    paddingVertical: 16,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
  },
  completedTaskItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  radioButton: {
    marginRight: 12,
    marginTop: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskDate: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  photoIndicatorText: {
    fontSize: 10,
    color: '#666666',
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  locationIndicatorText: {
    fontSize: 10,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  expandedSection: {
    gap: 8,
  },
  expandedSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  taskPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  mapContainer: {
    gap: 8,
    height: 200,
    width: '100%',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  noDetailContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  noDetailText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 200,
  },
  infoSection: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    maxWidth: 250,
  },
});