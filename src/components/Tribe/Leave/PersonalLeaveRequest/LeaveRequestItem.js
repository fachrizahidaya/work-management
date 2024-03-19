import dayjs from "dayjs";

import { View, Text, Pressable, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
  const renderStatus = () => {
    if (status === "Pending") {
      return (
        <Pressable
          style={{ marginRight: 1 }}
          onPress={() => {
            SheetManager.show("form-sheet", {
              payload: {
                children: (
                  <View style={styles.content}>
                    <Text style={styles.cancelText}>Cancel Request</Text>
                    <MaterialCommunityIcons name="close-circle-outline" size={20} color="#EB0E29" />
                  </View>
                ),
              },
            });
            onSelect(item);
          }}
        >
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" style={{ borderRadius: 20 }} />
        </Pressable>
      );
    } else if (status === "Approved" || status === "Rejected") {
      return (
        <Text style={styles.statusText}>
          {status} by {approval_by}
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      key={id}
      style={{
        ...styles.container,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>{leave_name}</Text>
        {renderStatus()}
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#595F69" }}>{reason}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            ...styles.time,
          }}
        >
          <MaterialCommunityIcons name="calendar-month" size={20} color="#3F434A" />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "400",
              color: "#595F69",
            }}
          >
            {dayjs(begin_date).format("DD MMM YYYY")} - {dayjs(end_date).format("DD MMM YYYY")} •
          </Text>
          <Text style={[{ fontSize: 10 }, TextProps]}>{days > 1 ? `${days} days` : `${days} day`}</Text>
        </View>
        {status === "Pending" ? (
          <Text
            style={{
              fontSize: 10,
              fontWeight: "400",
              color: "#377893",
              width: "30%",
              textAlign: "right",
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Waiting approval by {approval_by}
          </Text>
        ) : (status === "Approved" || "Rejected") && status !== "Canceled" ? (
          <Text
            style={{
              fontSize: 10,
              fontWeight: "400",
              color: "#377893",
              width: "20%",
              textAlign: "right",
            }}
            numberOfLines={2}
          >
            {status} by {approval_by}
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
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
});
