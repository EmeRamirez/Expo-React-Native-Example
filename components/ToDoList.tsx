// components/ToDoList.tsx
import { Task } from '@/types/tasks';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ToDoListProps {
  tasks: Task[];
}

export default function ToDoList({ tasks }: ToDoListProps) {
  // Debugging - remueve esto después
  React.useEffect(() => {
    console.log('Tasks en ToDoList:', tasks);
    tasks.forEach((task, index) => {
      console.log(`Task ${index}:`, {
        title: task.title,
        priority: task.priority,
        hasPriority: !!task.priority,
        priorityType: typeof task.priority
      });
    });
  }, [tasks]);

  const handleCompleteTask = (taskId: string) => {
    Alert.alert(
      'Completar Tarea',
      `Estás completando la tarea ${taskId}`,
      [{ text: 'OK' }]
    );
  };

  const handleShowCompletedTaskInfo = (taskId: string) => {
    Alert.alert(
      'Información de Tarea',
      `Se desplegará la info de la tarea completada ${taskId}`,
      [{ text: 'OK' }]
    );
  };

  const getPriorityValue = (priority: any): string => {
    if (!priority) return '';
    
    // Si es string, devolverlo directamente
    if (typeof priority === 'string') {
      return priority.toLowerCase();
    }
    
    // Si es objeto, buscar las propiedades comunes
    if (typeof priority === 'object') {
      return (
        priority.value?.toLowerCase() ||
        priority.name?.toLowerCase() ||
        priority.label?.toLowerCase() ||
        ''
      );
    }
    
    return '';
  };

  const getPriorityStyle = (priority: any) => {
    const priorityValue = getPriorityValue(priority);
    
    const priorityStyles = {
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow,
      alta: styles.priorityHigh,
      media: styles.priorityMedium,
      baja: styles.priorityLow,
    };
    
    return priorityStyles[priorityValue as keyof typeof priorityStyles] || styles.priorityMedium;
  };

  const getPriorityText = (priority: any): string => {
    const priorityValue = getPriorityValue(priority);
    
    const priorityTexts = {
      alta: 'Alta',
      media: 'Media',
      baja: 'Baja',
    };
    
    return priorityTexts[priorityValue as keyof typeof priorityTexts] || 'Media';
  };

  const renderTaskItem = (task: Task) => {
    const isCompleted = task.completed;
    const hasPriority = task.priority && getPriorityValue(task.priority);

    return (
      <View key={task.id} style={[
        styles.taskItem,
        isCompleted && styles.completedTaskItem
      ]}>
        {/* Radio button para todas las tareas */}
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => isCompleted ? handleShowCompletedTaskInfo(task.id) : handleCompleteTask(task.id)}
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
          {task.description && (
            <Text style={[
              styles.taskDescription,
              isCompleted && styles.completedText
            ]}>
              {task.description}
            </Text>
          )}
          {hasPriority && (
            <View style={[
                styles.priorityBadge,
                getPriorityStyle(task.priority)
            ]}>
              <Text style={styles.priorityText}>
                {getPriorityText(task.priority)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => Alert.alert("De veritas quieres eliminar?")}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-bin-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

        </View>

        {/* Icono para tareas completadas */}
        {isCompleted && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => handleShowCompletedTaskInfo(task.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    alignSelf: 'flex-end'
  },
});