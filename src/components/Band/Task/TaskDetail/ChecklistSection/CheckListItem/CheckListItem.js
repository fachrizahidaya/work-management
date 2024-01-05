import React from "react";

import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../../../../shared/CustomStylings";

const CheckListItem = ({ id, title, status, onPress, onPressDelete, disabled }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Pressable disabled={disabled} onPress={() => onPress(id, status)}>
          <MaterialCommunityIcons
            name={status === "Open" ? "checkbox-blank-circle-outline" : "checkbox-marked-circle-outline"}
            color={status === "Finish" ? "#176688" : "#3F434A"}
            size={20}
          />
        </Pressable>

        <Text style={[{ textDecorationLine: status === "Finish" ? "line-through" : "none" }, TextProps]}>{title}</Text>
      </View>

      {!disabled && (
        <Pressable disabled={disabled} onPress={() => onPressDelete(id)}>
          <MaterialCommunityIcons name="delete-outline" size={20} color="#3F434A" />
        </Pressable>
      )}
    </View>
  );
};

export default CheckListItem;
