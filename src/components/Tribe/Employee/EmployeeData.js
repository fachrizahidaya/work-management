import { Image, StyleSheet, View } from "react-native";

import EmployeeContact from "./EmployeeContact";
import EmployeeProfile from "./EmployeeProfile";
import EmployeeSelfProfile from "./EmployeeSelfProfile";

const EmployeeData = ({ userSelector, employee, teammates, reference }) => {
  return (
    <View>
      <Image source={require("../../../assets/profile_banner.jpg")} style={styles.image} alt="empty" />
      {/* When the employee id is not equal, it will appear the contacts of employee */}
      <View style={styles.information}>
        {userSelector?.id !== employee?.data?.user_id ? (
          <>
            <View style={styles.contact}>
              <EmployeeContact employee={employee} />
            </View>
            <EmployeeProfile employee={employee} teammates={teammates} reference={reference} />
          </>
        ) : (
          <EmployeeSelfProfile employee={employee} teammates={teammates} reference={reference} />
        )}
      </View>
    </View>
  );
};

export default EmployeeData;

const styles = StyleSheet.create({
  information: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    position: "relative",
    paddingHorizontal: 10,
  },
  image: {
    height: 100,
    width: 500,
    resizeMode: "cover",
    alignSelf: "center",
  },
  contact: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingTop: 2,
    gap: 5,
  },
});
