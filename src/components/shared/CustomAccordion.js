import React from "react";

import { View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../hooks/useDisclosure";
import { TextProps } from "./CustomStylings";

const CustomAccordion = ({ children, title, subTitle, hasAction }) => {
  const { isOpen, toggle } = useDisclosure(true);

  return (
    <View style={{ display: "flex", gap: 15 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Pressable style={{ display: "flex", flexDirection: "row", gap: 4 }} onPress={toggle}>
            <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={20} />
            <Text style={({ fontSize: 16 }, TextProps)}>{title}</Text>
            <Text style={({ fontSize: 16 }, TextProps)}>({subTitle})</Text>
          </Pressable>
        </View>

        {hasAction && (
          <Pressable>
            <MaterialCommunityIcons name="dots-horizontal" size={20} />
          </Pressable>
        )}
      </View>

      {isOpen && children}
    </View>
  );
};

export default CustomAccordion;
