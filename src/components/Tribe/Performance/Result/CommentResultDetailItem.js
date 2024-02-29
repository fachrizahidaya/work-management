import React from "react";

import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const CommentResultDetailItem = ({ id, type, total_comment, navigation }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => {
        navigation.navigate("Comment Employee", {
          id: id,
          type: type,
        });
      }}
    >
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Text style={[{ fontSize: 16, fontWeight: "700" }, TextProps]}>Comment</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[TextProps]}>Total Comments: </Text>
          <Text style={[TextProps]}>{total_comment?.length}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name={"chevron-right"} size={20} style={{ opacity: 0.5 }} />
    </Pressable>
  );
};

export default CommentResultDetailItem;
