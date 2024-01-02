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
  startIcon,
  endIcon,
  onPressEndIcon,
  onChangeText,
  endAdornment,
  startAdornment,
  multiline,
  numberOfLines,
  style,
  editable = true,
  innerRef,
  height,
  width,
  onTouchStart,
  keyboardType,
}) => {
  return (
    <View style={styles.wrapper}>
      {title && <Text style={{ marginBottom: 9, fontWeight: 500 }}>{title}</Text>}

      <View style={styles.inputWrapper}>
        {startIcon && (
          <TouchableOpacity style={styles.startIcon} onPress={onPressEndIcon}>
            <MaterialCommunityIcons name={startIcon} size={20} />
          </TouchableOpacity>
        )}

        {startAdornment && <View style={styles.startIcon}>{startAdornment}</View>}

        <TextInput
          keyboardType={keyboardType}
          ref={innerRef}
          editable={editable}
          selectTextOnFocus={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={placeHolder}
          onTouchStart={onTouchStart}
          onChangeText={(value) => {
            if (onChangeText) {
              onChangeText(value);
            } else {
              formik?.setFieldValue(fieldName, value);
            }
          }}
          autoCapitalize="none"
          style={[
            styles.input,
            style,
            {
              paddingLeft: startAdornment || startIcon ? 35 : 10,
              height: height ? height : multiline ? 100 : 40,
              width: width || "100%",
              textAlignVertical: "top",
              color: !editable ? "#cbcbcb" : "black",
            },
          ]}
          defaultValue={defaultValue}
          value={value}
          secureTextEntry={secureTextEntry}
        />

        {endIcon && (
          <TouchableOpacity style={styles.endIcon} onPress={onPressEndIcon}>
            <MaterialCommunityIcons name={endIcon} size={20} />
          </TouchableOpacity>
        )}

        {endAdornment && <View style={styles.endIcon}>{endAdornment}</View>}
      </View>

      {formik?.errors[fieldName] && <Text style={{ color: "red", marginTop: 9 }}>{formik.errors[fieldName]}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
  },
  startIcon: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  endIcon: {
    position: "absolute",
    right: 10,
    top: 11,
  },
});
