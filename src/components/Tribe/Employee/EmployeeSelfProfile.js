import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { CopyToClipboard } from "../../shared/CopyToClipboard";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const EmployeeSelfProfile = ({ employee, teammates, reference }) => {
  return (
    <>
      <View style={styles.avatar}>
        <AvatarPlaceholder size="xl" name={employee?.data?.name} image={employee?.data?.image} />
      </View>

      <View style={{ marginTop: -40 }}>
        <View style={styles.content}>
          <View>
            <View style={styles.information}>
              <Text style={{ fontSize: 20, fontWeight: "500", color: "#3F434A" }}>
                {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "400", color: "#8A9099" }}>
                {`(${employee?.data?.gender.charAt(0).toUpperCase() + employee?.data?.gender.slice(1)})`}
              </Text>
            </View>

            <Text style={{ fontSize: 14, fontWeight: "400", color: "#8A9099" }}>{employee?.data?.position_name}</Text>
          </View>
          <View>
            <View style={styles.information}>
              <MaterialCommunityIcons name="phone-outline" size={10} color="#3F434A" />
              <TouchableOpacity onPress={() => CopyToClipboard(employee?.data?.phone_number)}>
                <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>
                  {employee?.data?.phone_number}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.information}>
              <MaterialCommunityIcons name="cake-variant-outline" size={10} color="#3F434A" />
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>
                {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
              </Text>
            </View>
          </View>
          <View style={styles.information}>
            <Text>{teammates?.data.length}</Text>
            <TouchableOpacity onPress={() => reference.current?.show()}>
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>Teammates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default EmployeeSelfProfile;

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 5,
    position: "relative",
    bottom: 45,
  },
  content: {
    paddingBottom: 10,
    paddingHorizontal: 5,
    gap: 5,
  },
  information: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
