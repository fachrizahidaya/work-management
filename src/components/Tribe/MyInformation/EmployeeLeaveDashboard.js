import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EmployeeLeaveDashboard = ({ availableLeave, pendingApproval, approved, id }) => {
  const navigation = useNavigation();

  const items = [
    {
      id: 1,
      name: "Available Leave",
      icon: "clipboard-outline",
      qty: availableLeave,
      backgroundColor: "#E8E9EB",
      iconColor: "#377893",
      onPress: () =>
        navigation.navigate("New Leave Request", {
          employeeId: id,
        }),
    },
    {
      id: 2,
      name: "Pending Approval",
      icon: "clipboard-pulse-outline",
      qty: pendingApproval,
      backgroundColor: "#FAF6E8",
      iconColor: "#FFD240",
      onPress: () => navigation.navigate("Leave Requests"),
    },
    {
      id: 3,
      name: "Approved",
      icon: "clipboard-check-outline",
      qty: approved,
      backgroundColor: "#E9F5EC",
      iconColor: "#49C96D",
      onPress: () => navigation.navigate("Leave Requests"),
    },
  ];

  return (
    <View style={styles.icon}>
      {items.map((item) => {
        return (
          <Pressable onPress={item.onPress} key={item.id} style={styles.content}>
            <View style={{ ...styles.card, backgroundColor: item.backgroundColor }}>
              <MaterialCommunityIcons name={item.icon} size={30} color={item.iconColor} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>{item.qty}</Text>
            <Text
              style={{ fontSize: 12, fontWeight: "400", color: "#8A9099", textAlign: "center", width: 60, height: 40 }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default EmployeeLeaveDashboard;

const styles = StyleSheet.create({
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 15,
  },
});
