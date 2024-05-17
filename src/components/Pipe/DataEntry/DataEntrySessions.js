import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";

const DataEntrySessions = ({ date, shift, pic }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: 20 }}>
        <Text>{date}</Text>
        <Text>{shift}</Text>
        <Text>{pic}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} />
    </Pressable>
  );
};

export default DataEntrySessions;
