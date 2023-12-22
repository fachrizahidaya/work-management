import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import ActionSheet from "react-native-actions-sheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useGetSubMenu } from "../../../hooks/useGetSubMenu";

const TribeScreenSheet = (props) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  const { mergedMenu } = useGetSubMenu(menuSelector.user_menu);
  const excludeSubscreen = [
    "Divisions",
    "Job Positions",
    "Employees",
    "Leave Types",
    "Holidays",
    "Time Groups",
    "Leave Quota",
    "Attendance History",
    "Leave History",
    "Payroll Groups",
    "Payroll Components",
    "Upload Payslip",
  ];
  const filteredMenu = mergedMenu.filter((item) => !excludeSubscreen.includes(item.name));

  return (
    <ActionSheet ref={props.reference}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Dashboard");
          props.reference.current?.hide();
        }}
        style={styles.wrapper}
      >
        <View style={styles.flex}>
          <View style={styles.item}>
            <MaterialCommunityIcons size={20} name="rss" />
          </View>
          <Text style={styles.text}>Dashboard</Text>
        </View>
      </TouchableOpacity>

      {filteredMenu?.map((item, idx) => {
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              navigation.navigate(item.name);
              props.reference.current?.hide();
            }}
            style={styles.wrapper}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name={item.mobile_icon} />
              </View>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("My Information");
          props.reference.current?.hide();
        }}
        style={styles.wrapper}
      >
        <View style={styles.flex}>
          <View style={styles.item}>
            <MaterialCommunityIcons size={20} name="account-outline" />
          </View>
          <Text style={styles.text}>My Information</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Calendar Tribe");
          props.reference.current?.hide();
        }}
        style={styles.wrapper}
      >
        <View style={styles.flex}>
          <View style={styles.item}>
            <MaterialCommunityIcons size={20} name="calendar-clock" />
          </View>
          <Text style={styles.text}>Calendar</Text>
        </View>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default TribeScreenSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 21,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    color: "black",
  },
});
