import { Text, View } from "react-native";

import { card } from "../../../styles/Card";

const CourierPickupItem = ({ awb, courier }) => {
  return (
    <View style={[card.card, { marginVertical: 8, gap: 10 }]}>
      <Text>{awb}</Text>
      <Text>{courier}</Text>
    </View>
  );
};

export default CourierPickupItem;
