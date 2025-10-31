// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5E5",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen 
        name="inicio" 
        options={{
          title: "Inicio",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="configuracion" 
        options={{
          title: "Configuración",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "settings" : "settings-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
    </Tabs>
  );
}