import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity, View, Text } from "react-native";
import { Divider } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";

const EmployeeInformation = ({ id, name, position, email, phone, image, refetch }) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...card.card, marginTop: 5, gap: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: id,
                returnPage: "My Information",
                loggedEmployeeImage: image,
                loggedEmployeeId: id,
              })
            }
          >
            <AvatarPlaceholder image={image} name={name} size="lg" borderRadius="full" isThumb={false} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
              {name.length > 30 ? name.split(" ")[0] : name}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }}>{position}</Text>
          </View>
        </View>
      </View>

      <Divider />

      <View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#3F434A" }}>Phone:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }} onPress={() => CopyToClipboard(phone)}>
              {phone}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, fontWeight: "400" }}>Email:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#8A9099" }} onPress={() => CopyToClipboard(email)}>
              {email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmployeeInformation;
