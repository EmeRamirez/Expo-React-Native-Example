// services/base/ApiClient.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_URL } from '../../config';

// Tipos para errores de TU API específica
export interface ApiError {
  message: string;       // Mensaje de error para mostrar al usuario
  status?: number;       // HTTP status code
  code?: string;         // Código de error de Axios
  originalError?: any;   // Error original completo (para debugging)
}

// Tipo para errores de Zod que recibes
interface ZodErrorItem {
  origin?: string;
  code?: string;
  minimum?: number;
  inclusive?: boolean;
  path?: string[];
  message?: string;
}

// Configurar la URL base del API
const baseURL = API_URL;

// Crear instancia de Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================================================
// FUNCIÓN PARA MANEJAR ERRORES 
// ================================================

// Función helper para extraer mensaje de errores de Zod
const extractZodErrorMessage = (zodData: any): string => {
  try {
    // Si es un string que contiene JSON (como tu caso)
    if (typeof zodData === 'string') {
      // Intentar parsear el string JSON
      const parsed = JSON.parse(zodData);
      
      // Verificar si es un array de errores de Zod
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Extraer mensajes de cada error
        const errorMessages = parsed.map((error: ZodErrorItem) => {
          const field = error.path?.join('.') || 'campo';
          const message = error.message || 'Error de validación';
          return `${field}: ${message}`;
        });
        
        return errorMessages.join(', ');
      }
    }
    
    // Si ya es un objeto/array
    if (Array.isArray(zodData) && zodData.length > 0) {
      const firstError = zodData[0] as ZodErrorItem;
      const field = firstError.path?.join('.') || 'campo';
      const message = firstError.message || 'Error de validación';
      return `${field}: ${message}`;
    }
    
    return 'Error de validación en los datos';
  } catch (parseError) {
    // Si no se puede parsear, devolver el string original
    return typeof zodData === 'string' ? zodData : 'Error de validación';
  }
};

// Función para manejar errores de Axios CON TU FORMATO DE API
const handleApiError = (error: any): ApiError => {
  // Verificar si es un error de Axios
  if (axios.isAxiosError(error)) {
    
    // Error con respuesta del servidor (4xx, 5xx)
    if (error.response) {
      const { status, data } = error.response;
      
      let errorMessage = 'Error desconocido';
      let parsedData = data;
      
      // Intentar parsear si data es string (caso de ZodError)
      if (typeof data === 'string') {
        try {
          // Intentar parsear como JSON
          parsedData = JSON.parse(data);
        } catch {
          // Si no es JSON válido, mantener como string
          parsedData = data;
        }
      }
      
      // CASO 1: Error de Zod (el que estás recibiendo)
      if (parsedData && typeof parsedData === 'object') {
        // Verificar si es un error de Zod
        if (parsedData.name === 'ZodError' || 
            (parsedData.message && parsedData.message.includes('ZodError'))) {
          
          // Extraer mensaje del error de Zod
          const zodMessage = parsedData.message || parsedData;
          errorMessage = extractZodErrorMessage(zodMessage);
        }
        // CASO 2: Formato { success: false, error: "message" }
        else if (parsedData.success === false && parsedData.error) {
          errorMessage = String(parsedData.error);
        }
        // CASO 3: Formato con campo 'message'
        else if (parsedData.message) {
          errorMessage = String(parsedData.message);
        }
        // CASO 4: Si es un array con errores
        else if (Array.isArray(parsedData) && parsedData.length > 0) {
          const firstError = parsedData[0];
          if (firstError && firstError.message) {
            errorMessage = String(firstError.message);
          } else {
            errorMessage = 'Error de validación';
          }
        }
        // CASO 5: Fallback - convertir a string
        else {
          try {
            errorMessage = JSON.stringify(parsedData);
          } catch {
            errorMessage = 'Error en el servidor';
          }
        }
      }
      // CASO 6: Data es string simple
      else if (typeof parsedData === 'string') {
        errorMessage = parsedData;
      }
      
      return {
        message: errorMessage,
        status: status,
        code: error.code,
        originalError: parsedData,
      };
    }
    
    // Error de red (sin respuesta)
    if (error.request) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: error.code,
        originalError: error,
      };
    }
    
    // Error en la configuración de la solicitud
    return {
      message: error.message || 'Error en la configuración de la solicitud',
      code: error.code,
      originalError: error,
    };
  }
  
  // Si no es un error de Axios
  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
    originalError: error,
  };
};

// Métodos básicos del ApiClient con manejo de errores
export const ApiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  /**
 * Método especial para upload de archivos (multipart/form-data)
 */
  upload: async <T>(
    url: string, 
    formData: FormData, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },

  /**
   * Método para descargar archivos binarios
   */
  download: async (
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ArrayBuffer> => {
    try {
      const response = await axiosInstance.get(url, {
        ...config,
        responseType: 'arraybuffer', // Para recibir binario
      });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as AxiosError);
      throw apiError;
    }
  },
};

export default ApiClient;