import { TouchableOpacity, View, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const SupervisorInformation = ({
  supervisorId,
  supervisorName,
  supervisorEmail,
  supervisorPhone,
  supervisorImage,
  supervisorPosition,
  refetch,
  id,
  navigation,
  onClickCall,
}) => {
  const phoneNumber = supervisorPhone;
  const phoneUrl = `tel:0${phoneNumber}`;

  const handleNavigation = () => {
    navigation.navigate("Employee Profile", {
      employeeId: supervisorId,
      returnPage: "My Information",
      refetch: refetch,
      loggedEmployeeId: id,
    });
  };

  return (
    <View style={{ ...card.card, marginTop: 5, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={handleNavigation}>
            <AvatarPlaceholder image={supervisorImage} name={supervisorName} size="lg" isThumb={false} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
              {supervisorName.length > 30 ? supervisorName.split(" ")[0] : supervisorName}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>{supervisorPosition}</Text>
          </View>
        </View>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Phone:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <TouchableOpacity onPress={() => onClickCall(phoneUrl)}>
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>{supervisorPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Email:</Text>
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
