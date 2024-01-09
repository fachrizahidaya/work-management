import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../CustomStylings";

const Select = ({
  placeHolder,
  items = [],
  value,
  onChange,
  title,
  formik,
  fieldName = "",
  defaultValue,
  value1,
  hasParentSheet,
}) => {
  const onPressValue = (value) => {
    onChange(value);
    SheetManager.hide("select-sheet");
  };

  const valueToPrint = items.find((item) => item.value === value);

  return (
    <View style={styles.wrapper}>
      {title && <Text style={[{ marginBottom: 9 }, TextProps]}>{title}</Text>}

      <TouchableOpacity
        style={styles.select}
        onPress={async () => {
          hasParentSheet && (await SheetManager.hide("form-sheet"));
          SheetManager.show("select-sheet", {
            payload: {
              children: items,
              onChange: onPressValue,
            },
          });
        }}
      >
        {/* <Text style={TextProps}>{defaultValue ? defaultValue : value1 ? value1 : value ? value : placeHolder}</Text> */}
        <Text style={TextProps}>{valueToPrint?.label || placeHolder}</Text>

        <MaterialCommunityIcons name="chevron-down" style={styles.dropdownIcon} size={20} color="#3F434A" />
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
