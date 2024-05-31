import { Text, View } from "react-native";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const CourierItem = ({ name }) => {
  return (
    <View
      style={[
        card.card,
        {
          marginVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <Text style={[TextProps]}>{name}</Text>
    </View>
  );
};

export default CourierItem;
