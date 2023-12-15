import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Select = ({ placeHolder, items }) => {
  return (
    <>
      <TouchableOpacity
        style={styles.select}
        onPress={() =>
          SheetManager.show("select-sheet", {
            payload: {
              children: items,
            },
          })
        }
      >
        <Text>{placeHolder}</Text>

        <MaterialCommunityIcons name="chevron-down" style={styles.dropdownIcon} size={20} />
      </TouchableOpacity>
    </>
  );
};

export default Select;

const styles = StyleSheet.create({
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
