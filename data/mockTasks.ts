// mockTasks.ts
import { Task } from "@/types/tasks";
import { File, Paths } from "expo-file-system";

let mockTasks: Task[] = [];
const data = new File(Paths.cache, 'tareas.json');
try {
  const fileContent = data.textSync();
  mockTasks = fileContent ? JSON.parse(fileContent) : [];
} catch (error) {
  console.warn('El archivo de las tareas no existe', error);
}
console.log("Tareas cargadas:", mockTasks);

export { mockTasks };

