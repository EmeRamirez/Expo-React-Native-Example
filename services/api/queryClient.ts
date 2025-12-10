import { QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {  
      retry: 0,  // No reintentar mutaciones
      networkMode: 'offlineFirst',  // Útil para mobile
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Manejo centralizado de errores
      console.error(`Error en query ${query.queryKey}:`, error);
    }
  })
});