import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity } from "react-native";
import { Box, Divider, Flex, Icon, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";

const EmployeeInformation = ({ id, name, position, email, phone, image }) => {
  const navigation = useNavigation();

  const phoneNumber = `0${phone}`;

  return (
    <Flex mt={3} gap={5} style={card.card}>
      <Flex justifyContent="space-between" direction="row" gap={4}>
        <Flex gap={3} flexDir="row" alignItems="center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: id,
                returnPage: "My Information",
                loggedEmployeeImage: image,
              })
            }
          >
            <AvatarPlaceholder image={image} name={name} size="lg" borderRadius={10} />
          </TouchableOpacity>
          <Flex>
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {name.length > 30 ? name.split(" ")[0] : name}
            </Text>
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {position}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider />

      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12} color="#3F434A">
            Phone:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text onPress={() => CopyToClipboard(phoneNumber)} fontWeight={400} fontSize={12} color="#8A9099">
              0{phone}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12}>
            Email:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text onPress={() => CopyToClipboard(email)} fontWeight={400} fontSize={12} color="#8A9099">
              {email}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EmployeeInformation;
