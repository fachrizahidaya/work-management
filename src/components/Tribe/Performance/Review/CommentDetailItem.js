import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const CommentDetailItem = ({ description, handleOpen, item, employeeCommentValue, comment }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() => {
        handleOpen(item, employeeCommentValue);
      }}
    >
      <Text style={[TextProps]}>{description}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name={"chart-bar"} size={15} style={{ opacity: 0.5 }} />

        <Text style={[TextProps]}>{comment}</Text>
      </View>
    </Pressable>
  );
};

export default CommentDetailItem;
