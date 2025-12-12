// services/hooks/images/useUploadImage.ts
import { UploadImageParams, UploadImageResponse } from '@/types/images';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageService } from '../../api/images/imageService';
import { ApiError } from '../../base/ApiClient';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UploadImageResponse, ApiError, UploadImageParams>({
    mutationFn: ImageService.upload,
    onSuccess: (data) => {
      // Invalidar queries relacionadas con imágenes si las tienes
      queryClient.invalidateQueries({ queryKey: ['images'] });
      
      console.log('Imagen subida exitosamente:', data.data.url);
    },
    onError: (error) => {
      console.error('Error subiendo imagen:', error);
      
      // Manejo específico para errores de tamaño
      if (error.message?.includes('size') || error.message?.includes('5MB')) {
        throw { ...error, message: 'La imagen debe ser menor a 5MB' };
      }
      
      // Manejo específico para errores de formato
      if (error.message?.includes('format') || error.message?.includes('type')) {
        throw { ...error, message: 'Formato no válido. Usa JPEG, PNG, WebP o GIF' };
      }
    },
  });
};