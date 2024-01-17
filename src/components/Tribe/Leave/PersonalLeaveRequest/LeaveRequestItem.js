import dayjs from "dayjs";

import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const LeaveRequestItem = ({
  id,
  leave_name,
  reason,
  days,
  begin_date,
  end_date,
  status,
  item,
  onSelect,
  approval_by,
}) => {
  return (
    <View key={id} style={{ ...card.card, flexDirection: "column", marginVertical: 5, gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>{leave_name}</Text>
        {status === "Pending" ? (
          <Pressable
            style={{ marginRight: 1 }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View
                      style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16, marginBottom: 20 }}
                    >
                      <TouchableOpacity
                        onPress={async () => {
                          await SheetManager.hide("form-sheet");
                          onSelect(item);
                        }}
                      >
                        <Text style={[{ fontSize: 16 }, TextProps]}>Cancel Request</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                },
              })
            }
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" style={{ borderRadius: 20 }} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69", maxWidth: 300 }}>{reason}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
            padding: 5,
            borderRadius: 10,
            backgroundColor: "#F8F8F8",
          }}
        >
          <MaterialCommunityIcons name="clock-outline" size={20} color="#3F434A" />
          <Text style={[{ fontSize: 12 }, TextProps]}>{days > 1 ? `${days} days` : `${days} day`}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, fontWeight: "400", color: "#595F69" }}>
          {dayjs(begin_date).format("DD.MM.YYYY")} - {dayjs(end_date).format("DD.MM.YYYY")}
        </Text>
        {status === "Pending" ? (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#377893",
              width: 120,
              textAlign: "right",
            }}
            numberOfLines={2}
          >
            Waiting approval by {approval_by}
          </Text>
        ) : (status === "Approved" || "Rejected") && status !== "Canceled" ? (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#377893",
              width: 80,
              textAlign: "right",
            }}
            numberOfLines={2}
          >
            {status} by {approval_by}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#377893",
            }}
          >
            {status}
          </Text>
        )}
      </View>
    </View>
  );
};

export default LeaveRequestItem;
