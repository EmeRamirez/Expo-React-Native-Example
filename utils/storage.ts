import { User } from "@/types/auth";
import { Task } from "@/types/tasks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TODOS_STORAGE_KEY = "TODOS_APP_TASKS";
const SESSION_STORAGE_KEY = "TODOS_APP_SESSION";

export const saveTasksToStorage = async (tasks: Task[]) => {
    try {
        const tasksJson = JSON.stringify(tasks);
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, tasksJson);
        return true;
    } catch (error) {
        console.error("Error saving tasks to storage:", error);
        return false;
    }
};

export const getTasksFromStorage = async (): Promise<Task[]> => {
    try {
        const tasksJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);

        if (tasksJson) {
            return JSON.parse(tasksJson) as Task[]; 
        }
        return [];
    } catch (error) {
        console.error("Error retrieving tasks from storage:", error);
        return [];
    }
};

export const deleteTaskFromStorage = async (taskId: string): Promise<boolean> => {
    try {
        const tasks = await getTasksFromStorage();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        await saveTasksToStorage(filteredTasks);
        return true;
    } catch (error) {
        console.error("Error deleting task from storage:", error);
        return false;
    }
};

export const saveSessionToStorage = async (sessionData: User) => {
    try {
        const sessionJson = JSON.stringify(sessionData);
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, sessionJson);
    } catch (error) {
        console.error("Error saving session to storage:", error);
    }
};

export const getSessionFromStorage = async (): Promise<User | null> => {
    try {
        const sessionJson = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

        if (sessionJson) {
            return JSON.parse(sessionJson) as User; 
        }
        return null;
    } catch (error) {
        console.error("Error retrieving session from storage:", error);
        return null;
    }
};

export const clearSessionFromStorage = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing session from storage:", error);
    }
};