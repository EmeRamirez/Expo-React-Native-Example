// services/hooks/images/useDeleteImage.ts
import { DeleteImageResponse } from '@/types/images';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageService } from '../../api/images/imageService';
import { ApiError } from '../../base/ApiClient';

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeleteImageResponse, ApiError, { userId: string; imageId: string }>({
    mutationFn: ({ userId, imageId }) => ImageService.delete(userId, imageId),
    onSuccess: (data, variables) => {
      // Eliminar del caché las queries relacionadas con esta imagen
      queryClient.removeQueries({ queryKey: ['images', variables.userId, variables.imageId] });
      queryClient.removeQueries({ queryKey: ['images-base64', variables.userId, variables.imageId] });
      
      // Invalidar lista de imágenes si existe
      queryClient.invalidateQueries({ queryKey: ['images'] });
      
      console.log('Imagen eliminada:', data.data.message);
    },
    onError: (error) => {
      console.error('Error eliminando imagen:', error);
    },
  });
};