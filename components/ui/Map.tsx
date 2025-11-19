import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapProps {
  onLocationSelect: (location: Coordinate) => void;
  initialLocation?: Coordinate;
}

export default function Map({ onLocationSelect, initialLocation }: MapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    initialLocation || null
  );
  const [region, setRegion] = useState({
    latitude: 19.4326, // CDMX por defecto
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    onLocationSelect(coordinate); // 🔥 Entregar coordenadas inmediatamente
  };

  const handleMarkerDragEnd = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    onLocationSelect(coordinate); // 🔥 Entregar coordenadas cuando se mueve el marcador
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      const newLocation = { latitude, longitude };
      setSelectedLocation(newLocation);
      onLocationSelect(newLocation); // 🔥 Entregar coordenadas de ubicación actual
      
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  const centerOnSelectedLocation = () => {
    if (selectedLocation) {
      setRegion({
        ...selectedLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      Alert.alert(
        "Ubicación confirmada", 
        `Lat: ${selectedLocation.latitude.toFixed(6)}\nLng: ${selectedLocation.longitude.toFixed(6)}`
      );
    }
  };

  // Obtener ubicación actual al montar el componente
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Si hay una initialLocation, establecerla
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setRegion({
        ...initialLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [initialLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        showsMyLocationButton={false}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Ubicación seleccionada"
            description="Arrastra para mover o toca el mapa"
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            pinColor="blue"
          />
        )}
      </MapView>

      {/* Botón para centrar en ubicación actual */}
      <TouchableOpacity 
        style={styles.currentLocationButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Botón para centrar en ubicación seleccionada */}
      {selectedLocation && (
        <TouchableOpacity 
          style={styles.centerLocationButton}
          onPress={centerOnSelectedLocation}
        >
          <Ionicons name="navigate" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}

      {/* Indicador de instrucciones */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          📍 Toca el mapa para seleccionar ubicación
        </Text>
        <Text style={styles.instructionsText}>
          👐 Arrastra el marcador para moverlo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerLocationButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  instructions: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
});