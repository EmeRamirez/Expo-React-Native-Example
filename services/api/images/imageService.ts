// services/api/images/imageService.ts
import { API_URL } from '@/config';
import {
    DeleteImageResponse,
    UploadImageParams,
    UploadImageResponse,
} from '@/types/images';
import { getTokenFromStorage } from '@/utils/storage';
import ApiClient from '../../base/ApiClient';

// Función helper para obtener headers con token
const getAuthHeaders = async () => {
  const token = await getTokenFromStorage();
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Función helper para crear FormData desde una URI local (React Native)
const createImageFormData = (params: UploadImageParams): FormData => {
  const formData = new FormData();
  
  // Extraer nombre de archivo de la URI
  const uriParts = params.uri.split('/');
  const fileName = params.name || uriParts[uriParts.length - 1];
  
  // Inferir type si no se proporciona
  let type = params.type;
  if (!type) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    type = mimeTypes[extension || ''] || 'image/jpeg';
  }
  
  // Crear objeto file para React Native
  const file = {
    uri: params.uri,
    type: type,
    name: fileName,
  };
  
  formData.append('image', file as any);
  
  return formData;
};

export const ImageService = {
  /**
   * Subir una imagen (multipart/form-data)
   * @param imageParams Información de la imagen a subir
   */
  upload: async (imageParams: UploadImageParams): Promise<UploadImageResponse> => {
    const headers = await getAuthHeaders();
    const formData = createImageFormData(imageParams);
    
    return await ApiClient.upload<UploadImageResponse>('/images', formData, { headers });
  },

  /**
   * Descargar una imagen como ArrayBuffer (binario)
   * @param userId ID del usuario propietario
   * @param imageId ID de la imagen
   */
  download: async (userId: string, imageId: string): Promise<ArrayBuffer> => {
    // NOTA: Este endpoint es público, no necesita token
    return await ApiClient.download(`/images/${userId}/${imageId}`);
  },

  /**
   * Descargar una imagen y convertirla a base64
   * @param userId ID del usuario propietario
   * @param imageId ID de la imagen
   */
  downloadAsBase64: async (userId: string, imageId: string): Promise<string> => {
    try {
      const arrayBuffer = await ImageService.download(userId, imageId);
      
      // Convertir ArrayBuffer a base64
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error convirtiendo imagen a base64:', error);
      throw error;
    }
  },

  /**
   * Eliminar una imagen
   * @param userId ID del usuario propietario
   * @param imageId ID de la imagen
   */
  delete: async (userId: string, imageId: string): Promise<DeleteImageResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.delete<DeleteImageResponse>(
      `/images/${userId}/${imageId}`,
      { headers }
    );
  },

  /**
   * Generar URL pública de una imagen
   * @param userId ID del usuario propietario
   * @param imageId ID de la imagen
   */
  getPublicUrl: (userId: string, imageId: string): string => {
    // Asumiendo que tu API tiene una URL base pública para imágenes
    // Ajusta según tu configuración
    return `${API_URL}/images/${userId}/${imageId}`;
  },
};

export default ImageService;