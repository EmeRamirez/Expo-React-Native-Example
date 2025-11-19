import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import * as crypto from 'expo-crypto';
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from 'expo-file-system';
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { DropDownSelect } from "react-native-simple-dropdown-select";

export default function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titulo: "",
      descripcion: "",
      prioridad: "",
      imagen: null,
    },
  });
// La logica al final dar click en enviar formulario
  const onSubmit = (data: any) => {
      const tareasBDFile = new File(Paths.cache, 'tareas.json'); 

      if (!tareasBDFile.exists){
        tareasBDFile.create();
      }

      // Guardar la imagen en el sistema de archivos
      const uuid = crypto.randomUUID();
      const imageFile = new File(Paths.cache, `${uuid}.${selectedDocuments[0].uri.split('.').pop()}`);
      if (!imageFile.exists){

        try {
              imageFile.create();
      }
      catch (error) {
        console.log("Error creating image file: ", error);
      }
      // Enviamos los datos al archivo JSON
      const tarea = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        prioridad: data.prioridad.id,
        imagenPath: imageFile.uri,
      };
      const oldText = tareasBDFile.textSync();
      const newText = oldText ? `${oldText.slice(0, -1)},${JSON.stringify(tarea)}]` : `[${JSON.stringify(tarea)}]`;
      tareasBDFile.write(newText);
      // Alert.alert("Éxito", "Tarea guardada correctamente");
      // console.log("Tarea guardada: ", tarea);
      console.log(oldText);
      // router.replace("/(tabs)/inicio");
      
    };

  }
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(null);

  let prioridades = [
    { id: 1, name: "Baja" },
    { id: 2, name: "Media" },
    { id: 3, name: "Alta" },
    { id: 4, name: "Maxima" },
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
          name="titulo"
        />
        {errors.titulo && <Text>This is required.</Text>}

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
          name="descripcion"
        />
        {errors.descripcion && <Text>This is required.</Text>}


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
            onChange(data);}}
          dropDownContainerStyle={{
            maxHeight: 400,
            minWidth: 200,
      

          }}
          subViewStyle={styles.input}
          labelField="prioridad"
          valueField="id"
        />
          )}
          name="prioridad"
        />
        {errors.prioridad && <Text>This is required.</Text>}

        <View style={styles.imageUploadButton}>
          <Button 
            title="Añadir una imagen" 
            onPress={pickDocuments}
            variant="outlined"
            startIcon={
              <Ionicons 
                name="add-circle-outline" 
                size={20} 
                color="#ffffffff" 
              />
            }
            fullWidth
          />
        </View>

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  borderBottomContainer: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f2e1e1'
  },
imageUploadButton: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f2e1e1',
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
    width: '100%',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
  },
})