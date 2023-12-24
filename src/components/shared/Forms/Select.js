import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Select = ({ placeHolder, items, value, onChange, title, formik, fieldName = "", defaultValue }) => {
  const onPressValue = (value) => {
    onChange(value);
    SheetManager.hide("select-sheet");
  };
  return (
    <View style={styles.wrapper}>
      {title && <Text style={{ marginBottom: 9, fontWeight: 500 }}>{title}</Text>}

      <TouchableOpacity
        style={styles.select}
        onPress={() =>
          SheetManager.show("select-sheet", {
            payload: {
              children: items,
              onChange: onPressValue,
            },
          })
        }
      >
        <Text>{defaultValue ? defaultValue : value ? value : placeHolder}</Text>

        <MaterialCommunityIcons name="chevron-down" style={styles.dropdownIcon} size={20} />
      </TouchableOpacity>

      {formik?.errors[fieldName] && <Text style={{ color: "red", marginTop: 9 }}>{formik.errors[fieldName]}</Text>}
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  select: {
    height: 42,
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
