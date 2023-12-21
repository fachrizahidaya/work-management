import { Flex, Icon } from "native-base";
import { View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttendanceIcon = () => {
  const listIcons = [
    { key: "allGood", color: "#EDEDED", name: "All Good" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off" },
    { key: "sick", color: "red.600", name: "Sick" },
  ];

  return (
    <View style={styles.container}>
      {listIcons.map((item) => {
        return (
          <View key={item?.key} style={styles.content}>
            <Icon as={<MaterialCommunityIcons name="circle" />} color={item.color} size={3} />
            <Text style={{ fontSize: 12, fontWeight: "500" }}>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default AttendanceIcon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    paddingHorizontal: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
});
