import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
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
    { id: 1, name: "baja" },
    { id: 2, name: "media" },
    { id: 3, name: "alta" },
    { id: 4, name: "maxima" },
  ];

  return (
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

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
