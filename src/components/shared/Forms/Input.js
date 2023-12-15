import React from "react";

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Input = ({
  formik,
  fieldName = "",
  placeHolder,
  title,
  defaultValue,
  value,
  secureTextEntry,
  endIcon,
  onPressEndIcon,
  onChangeText,
  endAdornment,
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={{ marginBottom: 9 }}>{title}</Text>
      <TextInput
        placeholder={placeHolder}
        onChangeText={(value) => {
          if (onChangeText) {
            onChangeText(value);
          } else {
            formik?.setFieldValue(fieldName, value);
          }
        }}
        autoCapitalize="none"
        style={styles.input}
        defaultValue={defaultValue}
        value={value}
        secureTextEntry={secureTextEntry}
      />
      <Text style={{ color: "red", marginTop: 9 }}>{formik?.errors[fieldName]}</Text>

      {endIcon && (
        <TouchableOpacity style={styles.endIcon} onPress={onPressEndIcon}>
          <MaterialCommunityIcons name={endIcon} size={20} />
        </TouchableOpacity>
      )}
      {endAdornment && <View style={styles.endIcon}>{endAdornment}</View>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
  },
  endIcon: {
    position: "absolute",
    right: 20,
    top: 35,
  },
});
