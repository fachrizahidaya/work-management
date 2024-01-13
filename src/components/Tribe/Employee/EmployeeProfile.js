import dayjs from "dayjs";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { TextProps } from "../../shared/CustomStylings";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const EmployeeProfile = ({ employee, teammates }) => {
  return (
    <>
      <View style={styles.avatar}>
        <AvatarPlaceholder size="xl" name={employee?.data?.name} image={employee?.data?.image} isThumb={false} />
      </View>

      <View style={{ marginTop: -80 }}>
        <View style={styles.content}>
          <View>
            <View style={styles.information}>
              <Text style={{ fontSize: 20, fontWeight: "400", color: "#3F434A" }}>
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
            <Text style={[{ fontSize: 12 }, TextProps]}>{teammates?.data.length}</Text>
            <TouchableOpacity
              onPress={() =>
                SheetManager.show("form-sheet", {
                  payload: {
                    children: (
                      <View
                        style={{
                          display: "flex",
                          gap: 21,
                          paddingHorizontal: 20,
                          paddingVertical: 16,
                          marginBottom: 40,
                        }}
                      >
                        {teammates?.data.map((item, index) => {
                          return (
                            <View key={index} style={styles.contentTeammmates}>
                              <AvatarPlaceholder
                                image={item?.image}
                                name={item?.name}
                                size="md"
                                borderRadius="full"
                                isThumb={false}
                              />
                              <View>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
                                  {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                                </Text>
                                <Text style={{ fontSize: 12, fontWeight: "400", color: "#20A144" }}>
                                  {item?.position_name}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ),
                  },
                })
              }
            >
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>Teammates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default EmployeeProfile;

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 5,
    position: "relative",
    bottom: 90,
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
  contentTeammmates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
