// types/images.ts
export interface UploadImageResponse {
  success: true;
  data: {
    url: string;      // URL pública de la imagen
    key: string;      // Identificador único en Cloudflare R2
    size: number;     // Tamaño en bytes
    contentType: string; // Ej: "image/jpeg"
  };
}

export interface DeleteImageResponse {
  success: true;
  data: {
    message: string;
  };
}

export interface ImageErrorResponse {
  success: false;
  error: string;
}

// Tipos para upload
export interface UploadImageParams {
  uri: string;        // URI local de la imagen (file://...)
  name?: string;      // Nombre del archivo (opcional)
  type?: string;      // MIME type (opcional, se infiere de la extensión)
}

