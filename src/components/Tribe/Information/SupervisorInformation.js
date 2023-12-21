import { useNavigation } from "@react-navigation/native";

import { Linking, TouchableOpacity, View } from "react-native";
import { Box, Divider, Flex, Icon, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";

const SupervisorInformation = ({
  supervisorId,
  supervisorName,
  supervisorEmail,
  supervisorPhone,
  supervisorImage,
  supervisorPosition,
  refetch,
  id,
}) => {
  const phoneNumber = supervisorPhone;
  const phoneUrl = `tel:0${phoneNumber}`;

  const navigation = useNavigation();

  const handleCallPress = () => {
    Linking.openURL(phoneUrl).catch((err) => console.log(err));
  };

  return (
    <View style={{ ...card.card, marginTop: 5, gap: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: supervisorId,
                returnPage: "My Information",
                refetch: refetch,
                loggedEmployeeId: id,
              })
            }
          >
            <AvatarPlaceholder
              image={supervisorImage}
              name={supervisorName}
              size="lg"
              borderRadius={10}
              isThumb={false}
            />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
              {supervisorName.length > 30 ? supervisorName.split(" ")[0] : supervisorName}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>{supervisorPosition}</Text>
          </View>
        </View>
      </View>

      <Divider />

      <View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#3F434A" }}>Phone:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <TouchableOpacity onPress={handleCallPress}>
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>{supervisorPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, fontWeight: "400" }}>Email:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Text
              style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}
              onPress={() => CopyToClipboard(supervisorEmail)}
            >
              {supervisorEmail}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SupervisorInformation;
