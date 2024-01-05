import { StyleSheet, View, Text } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ClockAttendance = ({ attendance, item, currentTime, attendanceCheckHandler }) => {
  return (
    <View style={{ ...styles.container, backgroundColor: !attendance?.time_in ? "#daecfc" : "#feedaf" }}>
      <View style={{ paddingHorizontal: 1 }}>
        <MaterialCommunityIcons name={item.icons} size={20} color={!attendance?.time_in ? "#2984c3" : "#fdc500"} />
      </View>
      {!attendance?.time_in ? (
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#2984c3", marginHorizontal: 22 }}>Clock in</Text>
      ) : (
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#fdc500", marginHorizontal: 22 }}>Clock out</Text>
      )}

      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: !attendance?.time_in ? "#2984c3" : "#fdc500",
          marginLeft: 170,
        }}
      >
        {currentTime}
      </Text>
    </View>
  );
};

export default ClockAttendance;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
});
