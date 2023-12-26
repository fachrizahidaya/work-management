import dayjs from "dayjs";

import { Badge } from "native-base";
import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";

const LeaveRequestItem = ({ id, leave_name, reason, days, begin_date, end_date, status, item, onSelect }) => {
  return (
    <View key={id} style={{ ...card.card, flexDirection: "column", marginVertical: 5, gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>{leave_name}</Text>
        {status === "Pending" ? (
          <Pressable
            onPress={() => {
              onSelect(item);
            }}
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#000000" style={{ borderRadius: 20 }} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69", maxWidth: 300 }}>{reason}</Text>
        </View>
        <Badge borderRadius={10} w={20}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#186688" />
            <Text>{days > 1 ? `${days} days` : `${days} day`}</Text>
          </View>
        </Badge>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>
          {dayjs(begin_date).format("DD.MM.YYYY")} - {dayjs(end_date).format("DD.MM.YYYY")}
        </Text>
        <Text style={{ color: "#FF6262" }}>{status}</Text>
      </View>
    </View>
  );
};

export default LeaveRequestItem;
