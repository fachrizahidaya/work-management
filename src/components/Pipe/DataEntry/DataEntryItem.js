import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";

const DataEntryItem = ({ date, shift, pic, navigation, dayjs }) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => navigation.navigate("Entry Session")}
    >
      <View style={{ gap: 20 }}>
        <Text>Date: {dayjs(date).format("DD MMM YYYY")}</Text>
        <Text>Shift: {shift}</Text>
        <Text>PIC: {pic}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} />
    </Pressable>
  );
};

export default DataEntryItem;
