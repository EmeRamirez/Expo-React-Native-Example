// services/hooks/images/useDownloadImageAsBase64.ts
import { useQuery } from '@tanstack/react-query';
import { ImageService } from '../../api/images/imageService';
import { ApiError } from '../../base/ApiClient';

interface DownloadImageAsBase64Params {
  userId: string;
  imageId: string;
  enabled?: boolean;
}

export const useDownloadImageAsBase64 = ({ 
  userId, 
  imageId, 
  enabled = true 
}: DownloadImageAsBase64Params) => {
  return useQuery<string, ApiError>({
    queryKey: ['images-base64', userId, imageId],
    queryFn: () => ImageService.downloadAsBase64(userId, imageId),
    enabled: enabled && !!userId && !!imageId,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};