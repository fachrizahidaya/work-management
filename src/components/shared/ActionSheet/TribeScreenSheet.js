import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import ActionSheet from "react-native-actions-sheet";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useGetSubMenu } from "../../../hooks/useGetSubMenu";
import { TextProps } from "../CustomStylings";

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
    "Dashboard",
    "Performance Review",
    "Performance KPI",
    "Performance Appraisal",
    "Announcement",
    // "Employee KPI",
    // "Employee Appraisal",
    // "Employee Review",
    // "Performance Result",
  ];
  const filteredMenu = mergedMenu.filter((item) => !excludeSubscreen.includes(item.name));

  return (
    <ActionSheet ref={props.reference}>
      <View
        style={{
          paddingBottom: 40,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            maxHeight: 500,
            // paddingBottom: 40
          }}
        >
          {filteredMenu?.map((item, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  navigation.navigate(item.name);
                  props.reference.current?.hide();
                }}
                style={{
                  ...styles.wrapper,
                  borderBottomWidth: 1,
                  borderColor: "#E8E9EB",
                }}
              >
                <View style={styles.flex}>
                  <View style={styles.item}>
                    <MaterialCommunityIcons
                      size={20}
                      name={item.mobile_icon ? item.mobile_icon : item.icon}
                      color="#3F434A"
                    />
                  </View>
                  <Text style={[{ fontSize: 14 }, TextProps]}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("Evaluation");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="file-check-outline" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Evaluation</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("My Information");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="account-outline" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>My Information</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Calendar Tribe");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="calendar-clock" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Calendar</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

export default TribeScreenSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
