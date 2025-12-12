// components/ToDoList.tsx
import { Todo } from '@/types/todos';
import { deleteTaskFromStorage, updateCompletedTaskStatus } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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
}

// EN ESTE COMPONENTE SE DEBE AÑADIR:
/* 
  - Boton de eliminacion de tarea
  - Función para completar tarea
  - Contenedor desplegable para ver foto y ubicación de la tarea (si existen)
*/

export default function ToDoList({ tasks }: ToDoListProps) {
  const [expandedTasks, setExpandedTasks] = useState<{[key: string]: boolean}>({});
  const [isDeleting, setIsDeleting] = useState<{[key: string]: boolean}>({});

  const handleCompleteTask = (taskId: string) => {
    Alert.alert(
      'Completar Tarea',
      `Estás completando la tarea ${taskId}`,
      [{ text: 'OK' }]
    );
  };

  const toggleTaskStatus = async(taskId: string) => {
    // Si la tarea ya está completada, se pasa a no completada y viceversa
    if (expandedTasks[taskId]) {
      const res = await updateCompletedTaskStatus(taskId, false);
      if (res) {
        setExpandedTasks(prev => ({
          ...prev,
          [taskId]: false
        }));
      }
    } else {
      const res = await updateCompletedTaskStatus(taskId, true);
      if (res) {
        setExpandedTasks(prev => ({
          ...prev,
          [taskId]: true
        }));
      }
    }
  };

  const handleShowCompletedTaskInfo = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId] // Alternar el estado de expansión para esta tarea específica
    }));
  };

  const handleDeleteTask = async(taskId: string) => {
    if (isDeleting[taskId]) return; // Prevenir múltiples pulsaciones

    setIsDeleting(prev => ({
      ...prev,
      [taskId]: true
    }));

    const res = await deleteTaskFromStorage(taskId);

    if (res) {
      Alert.alert(
        'Eliminar Tarea',
        `Tarea ${taskId} eliminada correctamente.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error',
        `No se pudo eliminar la tarea ${taskId}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderTaskItem = (task: Todo) => {
    const isCompleted = task.completed;
    const isExpanded = expandedTasks[task.id];

    const getPriorityStyle = (priority: string) => {
        const priorityStyles = {
            high: styles.priorityHigh,
            medium: styles.priorityMedium,
            low: styles.priorityLow,
        };
        return priorityStyles[priority as keyof typeof priorityStyles];
    };

    return (
      <View 
        key={task.id}
        style={styles.generalContainer}
      >

        <View style={[
          styles.taskItem,
          isCompleted && styles.completedTaskItem
        ]}>
          {/* Radio button para todas las tareas */}
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => toggleTaskStatus(task.id)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {isCompleted && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Contenido de la tarea */}
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              isCompleted && styles.completedText
            ]}>
              {task.title}
            </Text>
            {/* {task.description && (
              <Text style={[
                styles.taskDescription,
                isCompleted && styles.completedText
              ]}>
                {task.description}
              </Text>
            )}
            {task.priority && (
              <View style={[
                  styles.priorityBadge,
                  getPriorityStyle(task.priority)
              ]}>
                <Text style={styles.priorityText}>
                  {task.priority === 'high' ? 'Alta' : 
                  task.priority === 'medium' ? 'Media' : 'Baja'}
                </Text>
              </View>
            )} */}
          </View>

          {/* Iconos para "Ver más" y "Eliminar" */}
          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => handleShowCompletedTaskInfo(task.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(task.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

        </View>

        {isExpanded && (
          // ACA SE DEBE RENDERIZAR UN COMPONENTE QUE RECIBE TASK Y MUESTRA LA INFO ADICIONAL
          <View style={styles.expandedContainer}>
            {/* <Text>Se muestra la info de la tarea completada {task.id}</Text> */}
            {task.photoUri ? (
              <Image source={{ uri: task.photoUri }} style={styles.taskPhoto} />
            ) : <View style={styles.noDetailContainer}><Text style={styles.noDetailText}>No hay foto asociada a esta tarea.</Text></View>}
            {task.location ? (
              <View style={styles.mapContainer}>
                <Map initialLocation={task.location} onLocationSelect={() => {}} />
              </View>
            ) : <View style={styles.noDetailContainer}><Text style={styles.noDetailText}>No hay ubicación asociada a esta tarea.</Text></View>}
          </View>
          )}
      </View>
      
    );
  };

  return (
    <ScrollView style={styles.container}>
      {tasks.map(renderTaskItem)}
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
  expandedContainer: {
    flexDirection: 'row',
    marginTop: 18,
    width: '100%',
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  completedTaskItem: {
    backgroundColor: '#F8F8F8',
  },
  radioButton: {
    marginRight: 12,
    marginTop: 2,
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
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  priorityHigh: {
    backgroundColor: '#FF3B30',
  },
  priorityMedium: {
    backgroundColor: '#FF9500',
  },
  priorityLow: {
    backgroundColor: '#34C759',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  taskPhoto: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskLocation: {
    fontSize: 14,
    color: '#37373aff',
  },
  mapContainer: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noDetailContainer: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  noDetailText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});