import dayjs from "dayjs";

import { View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../../shared/CustomStylings";

const LeaveRequestItem = ({
  leave_name,
  reason,
  days,
  begin_date,
  end_date,
  status,
  item,
  onSelect,
  approval_by,
  supervisor_name,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>{leave_name}</Text>
        {status === "Pending" ? (
          <Pressable
            style={{ marginRight: 1 }}
            onPress={() =>
              SheetManager.show("form-sheet", {
                payload: {
                  children: (
                    <View style={styles.wrapper}>
                      <TouchableOpacity
                        onPress={async () => {
                          await SheetManager.hide("form-sheet");
                          onSelect(item);
                        }}
                        style={styles.content}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#D64B4B" }}>Cancel Request</Text>
                        <MaterialCommunityIcons name={"close-circle-outline"} size={20} color="#EB0E29" />
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
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#595F69" }}>{reason}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
        <View style={styles.time}>
          <MaterialCommunityIcons name="calendar-month" size={20} color="#3F434A" />
          <Text style={{ fontSize: 10, fontWeight: "400", color: "#595F69" }}>
            {dayjs(begin_date).format("DD MMM YYYY")} - {dayjs(end_date).format("DD MMM YYYY")} •
          </Text>
          <Text style={[{ fontSize: 10 }, TextProps]}>{days > 1 ? `${days} days` : `${days} day`}</Text>
        </View>
        {status === "Pending" ? (
          <Text
            style={{ fontSize: 10, fontWeight: "400", color: "#377893", width: "30%", textAlign: "right" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Waiting approval by {approval_by}
          </Text>
        ) : (status === "Approved" || "Rejected") && status !== "Canceled" ? (
          <Text
            style={{ fontSize: 10, fontWeight: "400", color: "#377893", width: "20%", textAlign: "right" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {status} by {approval_by || supervisor_name}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default LeaveRequestItem;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    gap: 10,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginVertical: 4,
    marginHorizontal: 14,
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
  },
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
});
