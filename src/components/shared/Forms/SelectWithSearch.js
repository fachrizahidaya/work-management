import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "./Input";
import { TextProps } from "../CustomStylings";

const SelectWithSearch = ({
  items = [],
  value,
  placeHolder,
  onChange,
  title,
  formik,
  fieldName = "",
  reference,
  inputToShow,
  fieldNameSearch,
  setInputToShow,
  setSearchInput,
  handleSearch,
  height, // adjust height
}) => {
  const onPressValue = (value) => {
    onChange(value);
    reference.current?.hide();
    setSearchInput("");
    setInputToShow("");
  };

  const valueToPrint = items.find((item) => item.value === value);

  return (
    <View style={styles.wrapper}>
      {title && <Text style={[{ marginBottom: 9 }, TextProps]}>{title}</Text>}

      <TouchableOpacity onPress={() => reference.current?.show()} style={styles.select}>
        <ActionSheet
          ref={reference}
          onClose={() => {
            reference.current?.hide();
            setSearchInput("");
            setInputToShow("");
          }}
        >
          <View style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 21, paddingBottom: 40 }}>
            <Input
              value={inputToShow}
              fieldName={fieldNameSearch}
              startIcon="magnify"
              endIcon={inputToShow && "close-circle-outline"}
              onPressEndIcon={() => {
                setInputToShow("");
                setSearchInput("");
              }}
              onChangeText={(value) => {
                handleSearch(value);
                setInputToShow(value);
              }}
              placeHolder="Search..."
              height={40}
            />

            {items.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onPressValue(item.value);
                  }}
                  key={index}
                >
                  <Text style={[TextProps]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ActionSheet>
        <Text style={[{ fontSize: 12 }, TextProps]}>{valueToPrint?.label || placeHolder}</Text>
        <MaterialCommunityIcons name="chevron-down" style={styles.dropdownIcon} size={20} color="#3F434A" />
      </TouchableOpacity>
      {formik?.errors[fieldName] && <Text style={{ color: "red", marginTop: 9 }}>{formik.errors[fieldName]}</Text>}
    </View>
  );
};

export default SelectWithSearch;

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
