import Button from "@/components/ui/Button";
import Map from "@/components/ui/Map";
import { Task } from "@/types/tasks";
import { Ionicons } from "@expo/vector-icons";
import * as crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { DropDownSelect } from "react-native-simple-dropdown-select";

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      creationDate: new Date(),
      imgUrl: undefined,
      location: undefined,
      completedAt: null,
      priority: undefined,
    },
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    null
  );

  // La logica al final dar click en enviar formulario
  const onSubmit = (data: any) => {
    const tareasBDFile = new File(Paths.cache, "tareas.json");

    if (!tareasBDFile.exists) {
      tareasBDFile.create();
    }
    const oldText = tareasBDFile.textSync();
    let tareas = [];
    let nuevoId = 1;

    if (oldText && oldText.trim() !== "") {
      try {
        tareas = JSON.parse(oldText);
        // Asegurarnos que es un array
        if (Array.isArray(tareas) && tareas.length > 0) {
          // Encontrar el ID máximo y sumar 1
          const maxId = Math.max(
            ...tareas.map((tarea) => parseInt(tarea.id) || 0)
          );
          nuevoId = maxId + 1;
        }
      } catch (error) {
        console.log("Error parsing JSON, starting fresh: ", error);
        tareas = [];
      }
    }
    const imageUri: string | undefined = undefined;

    if (selectedDocuments && selectedDocuments.length > 0) {
      try {
        const uuid = crypto.randomUUID();
        const src = selectedDocuments[0].uri;
        const extension = src.split('.').pop() ?? 'jpg'
        const imageFile = new File(Paths.cache, `${uuid}.${extension}`)
        imageFile.create();
      } catch (error) {
        console.log("Error creating image file: ", error);
      }
    }

    const tarea: Task = {
      id: nuevoId.toString(), // Usamos el ID calculado
      title: data.title,
      description: data.description,
      completed: false,
      creationDate: new Date(),
      imgUrl: imageUri ?? undefined,
      location: selectedLocation ?? undefined,
      completedAt: null,
      priority: data.priority.name,
    };

    tareas.push(tarea);

    try {
      tareasBDFile.write(JSON.stringify(tareas, null, 2));
      Alert.alert("Éxito", "Tarea guardada correctamente");
      console.log("Tarea guardada: ", tarea);
      router.replace({
        pathname: "/(tabs)/inicio",
        params: { refresh: Date.now() }, // Timestamp único
      });
    } catch (error) {
      console.log("Error writing to file: ", error);
    }
  };

  let prioridades = [
    { id: 1, name: "Baja" },
    { id: 2, name: "Media" },
    { id: 3, name: "Alta" },
  ];

  const [selectedDocuments, setSelectedDocuments] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: ["image/*"],
      });
      if (!result.canceled) {
        const successResult =
          result as DocumentPicker.DocumentPickerSuccessResult;
        setSelectedDocuments([successResult.assets[0]]);
      } else {
        console.log("Document selection cancelled");
      }
    } catch {
      console.log("Error picking documents: ");
    }
  };

  return (
    <>
      <View style={styles.content}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Titulo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="title"
        />
        {errors.title && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="description"
        />
        {errors.description && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DropDownSelect
              placeholder="Selecciona la prioridad"
              toggle={() => setOpen(!open)}
              selectedData={value}
              open={open}
              data={prioridades}
              onSelect={(data) => {
                setValue(data);
                setOpen(false);
                onChange(data);
              }}
              dropDownContainerStyle={{
                maxHeight: 400,
                minWidth: 200,
              }}
              subViewStyle={styles.input}
              labelField="prioridad"
              valueField="name"
            />
          )}
          name="priority"
        />
        {errors.priority && <Text>This is required.</Text>}

        <View style={styles.imageUploadButton}>
          <Button
            title="Añadir una imagen"
            onPress={pickDocuments}
            variant="outlined"
            startIcon={
              <Ionicons name="add-circle-outline" size={20} color="#ffffffff" />
            }
            fullWidth
          />
        </View>

        <Map
          onLocationSelect={(location) => {
            setSelectedLocation(location);
            setValue(location);
          }}
        />

        <Button
          title="Submit"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  borderBottomContainer: {
    width: "100%",
    gap: 12,
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f2e1e1",
  },
  imageUploadButton: {
    width: "100%",
    gap: 12,
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f2e1e1",
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  tasksSection: {
    flex: 1,
    width: "100%",
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  tasksContainer: {
    flex: 1,
    width: "100%",
  },
  submitButton: {
    margin: 24,
  },
});
