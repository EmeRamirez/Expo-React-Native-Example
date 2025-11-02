
# 📱 Documentación de la Aplicación React Native con Expo

### Descripción
Esta aplicación fue desarrollada con el fin de explorar el framework Expo. No tiene ningún fin de lucro y es de carácter educativo.

### Características
✅ Framework: React Native con Expo

✅ Navegación: Expo Router (File-based routing)

✅ Lenguaje: TypeScript para type safety

✅ Estado Global: Context API con AuthProvider

✅ UI Components: Componentes reutilizables y personalizables

✅ Autenticación: Sistema de login con usuarios mock

✅ Layout: CustomHeader inteligente con navegación condicional

✅ Desarrollo: Asistencia con IA para agilizar desarrollo (Diseño de vistas)

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
├── assets/                # Recursos estáticos
│   └── images/           # Iconos, imágenes
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de interfaz
│   │   └── Button.tsx   # Botón personalizado
│   └── layout/          # Componentes de layout
│       └── CustomHeader.tsx # Header personalizado
├── context/             # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── types/               # Definiciones TypeScript
│   └── auth.ts         # Tipos para autenticación
├── data/               # Datos mock y estáticos
    └── mockUsers.ts    # Usuarios de prueba
```


##### Desarrollado por grupo Compila o Lloro - IPSS 2025

- Amanecer Cabrera
- Camila Astorga
- Emerson Ramírez

