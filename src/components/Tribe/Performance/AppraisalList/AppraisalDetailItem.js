import React, { useEffect, useState } from "react";

import { Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import Input from "../../../shared/Forms/Input";
import { TextProps } from "../../../shared/CustomStylings";

const AppraisalDetailItem = ({
  choice,
  description,
  item,
  choice_a,
  choice_b,
  choice_c,
  choice_d,
  choice_e,
  handleOpen,
}) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() => {
        handleOpen(item);
      }}
    >
      <Text style={[TextProps]}>{description}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name={"widgets-outline"} size={15} style={{ opacity: 0.5 }} />

        <Text style={[TextProps]}>
          {choice == "a"
            ? choice_a
            : choice == "b"
            ? choice_b
            : choice == "c"
            ? choice_c
            : choice == "d"
            ? choice_d
            : choice == "e"
            ? choice_e
            : null}
        </Text>
      </View>
    </Pressable>
  );
};

export default AppraisalDetailItem;
