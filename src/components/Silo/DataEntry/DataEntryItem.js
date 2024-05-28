import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";

const DataEntryItem = ({ awb, courier }) => {
  return (
    <View style={[card.card, { marginVertical: 8, gap: 10 }]}>
      <Text>{awb}</Text>
      <Text>{courier}</Text>
    </View>
  );
};

export default DataEntryItem;
