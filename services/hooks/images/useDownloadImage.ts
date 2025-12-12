// services/hooks/images/useDownloadImage.ts
import { useQuery } from '@tanstack/react-query';
import { ImageService } from '../../api/images/imageService';
import { ApiError } from '../../base/ApiClient';

interface DownloadImageParams {
  userId: string;
  imageId: string;
  enabled?: boolean;
}

export const useDownloadImage = ({ 
  userId, 
  imageId, 
  enabled = true 
}: DownloadImageParams) => {
  return useQuery<ArrayBuffer, ApiError>({
    queryKey: ['images', userId, imageId],
    queryFn: () => ImageService.download(userId, imageId),
    enabled: enabled && !!userId && !!imageId,
    staleTime: Infinity, // Las imágenes no cambian frecuentemente
    gcTime: 24 * 60 * 60 * 1000, // Cache por 24 horas
    retry: 1,
  });
};