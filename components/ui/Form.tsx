import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
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
    },
  });
  const onSubmit = (data: any) => console.log(data);
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
      } else {
        console.log("Document selection cancelled");
      }
    } catch {
      console.log("Error picking documents: ");
    }
  };

  return (
    <>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
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
              placeholder="Descripción"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="descripcion"
        />
        {errors.descripcion && <Text>This is required.</Text>}

        <DropDownSelect
          toggle={() => setOpen(!open)}
          selectedData={value}
          open={open}
          data={prioridades}
          onSelect={(data) => {
            setValue(data);
            setOpen(false);
          }}
          dropDownContainerStyle={{
            maxHeight: 400,
            minWidth: 200,
          }}
          search
          subViewStyle={{
            backgroundColor: "pink",
            borderWidth: 1,
          }}
        />

        <View style={styles.imageUploadButton}>
          <Button 
            title="Añadir una imagen" 
            onPress={pickDocuments}
            variant="primary"
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
});