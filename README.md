
# 📱 Documentación de la Aplicación React Native con Expo

### Descripción
Esta aplicación fue desarrollada con el fin de explorar el framework Expo. No tiene ningún fin de lucro y es de carácter educativo.

### Características
✅ Framework: React Native con Expo

✅ Navegación: Expo Router (File-based routing)

✅ Lenguaje: TypeScript para type safety

✅ Estado Global y Autenticación: Context API con AuthProvider y manejo de sesiones

✅ UI Components: Componentes reutilizables y personalizables

✅ Layout: CustomHeader inteligente con navegación condicional

✅ Persistencia de datos: Persistencia de datos por medio de base de datos NoSql (MongoDB)

✅ Persistencia de datos: AsyncStorage para datos locales, tokens y sesiones

✅ Persistencia de impagenes: Almacenamiento de imágenes con CDN global (Cloudflare R2)

✅ API para uso de cámara y GPS: Funcionalidades compatibles con iOS y Android

✅ Desarrollo: Asistencia con IA para agilizar desarrollo (Diseño de vistas y optimización de servicios)

### Comunicación con Backend
- Axios: Cliente HTTP con interceptores, manejo de errores centralizado y tipado TypeScript
- API RESTful: Consumo de endpoints autenticados con JWT
- Manejo de Errores: Sistema centralizado para errores de API, red y validación (incluyendo Zod)

### Sistema de Autenticación
- JWT (JSON Web Tokens): Autenticación stateless con expiración
- Protección de Rutas: Middleware a nivel de navegación y API
- Almacenamiento Seguro: Tokens en AsyncStorage con encriptación


### Requisitos Previos
Node.js (Versión 18 o superior)

Tener instalado Expo CLI

(Opcional) Tener instalado Expo Go en el dispositivo móvil

### Instalación
#### 1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd ev-1
```
#### 2. Instalar dependencias
```
npm install
```

#### 3. Crear variable de entorno para la API
Crear archivo .env.local en la raíz del proyecto con el siguiente contenido
```
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

#### 3. Iniciar el servidor de desarrollo
```
npm start
```

#### 4. (Opcional) Escanear el código QR con la app Expo Go o ejecutar en emulador/simulador:

##### - Para iOS: presiona 'i'
##### - Para Android: presiona 'a'


### Estructura del proyecto

```
mi-proyecto-react-native/
├── app/                    # Directorio principal de la app (Expo Router)
│   ├── (tabs)/            # Grupo de rutas para tabs
│   │   ├── _layout.tsx    # Layout de las tabs
│   │   ├── inicio.tsx     # Pantalla de inicio
│   │   └── configuracion.tsx # Pantalla de configuración
│   ├── login.tsx          # Pantalla de login
│   ├── index.tsx          # Pantalla principal/landing
│   └── _layout.tsx        # Layout raíz de la app
├── services/              # Capa de servicios y API
│   ├── api/              # Configuración y clientes HTTP
│   │   ├── queryClient.ts # Configuración de TanStack Query
│   │   ├── ApiClient.ts  # Cliente Axios con interceptores
│   │   ├── todos/        # Servicios de tareas
│   │   │   └── todoService.ts # CRUD de tareas
│   │   └── images/       # Servicios de imágenes
│   │       └── imageService.ts # Upload/delete a Cloudflare R2
├── assets/                # Recursos estáticos
│   └── images/           # Iconos, imágenes
├── components/           # Componentes reutilizables varios
│   ├── ui/              # Componentes de interfaz
│   │   └── Button.tsx   # Botón personalizado
│   └── layout/          # Componentes de layout
│       └── CustomHeader.tsx # Header personalizado
├── context/             # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── types/               # Definiciones TypeScript
│   └── auth.ts         # Tipos para autenticación
│   └── images.ts       # Tipos para imágenes
│   └── todos.ts        # Tipos para todos  
└── utils/              # Utilidades varias
    └── storage.ts      # funciones CRUD con AsyncStorage
```


##### Desarrollado por grupo Compila o Lloro - IPSS 2025

- Amanecer Cabrera
- Camila Astorga
- Emerson Ramírez
- Carlos Gonzalez

* Este README fue desarrollado con ayuda de IA