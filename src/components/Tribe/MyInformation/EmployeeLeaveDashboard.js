import { StyleSheet, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const EmployeeLeaveDashboard = ({ leaveStatus }) => {
  return (
    <View style={styles.icon}>
      {leaveStatus.map((item) => {
        return (
          <Pressable onPress={item.onPress} key={item.id} style={styles.content}>
            <View style={{ ...styles.card, backgroundColor: item.backgroundColor }}>
              <MaterialCommunityIcons name={item.icon} size={30} color={item.iconColor} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>{item.qty}</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#8A9099",
                textAlign: "center",
                width: 60,
                height: 40,
              }}
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
