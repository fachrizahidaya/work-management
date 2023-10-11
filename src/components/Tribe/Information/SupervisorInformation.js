import { Linking, TouchableOpacity } from "react-native";
import { Box, Divider, Flex, Icon, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";

const SupervisorInformation = ({
  supervisorName,
  supervisorEmail,
  supervisorPhone,
  supervisorImage,
  supervisorPosition,
}) => {
  const phoneNumber = supervisorPhone;
  const phoneUrl = `tel:0${phoneNumber}`;

  const handleCallPress = () => {
    Linking.openURL(phoneUrl).catch((err) => console.log(err));
  };

  return (
    <Flex gap={5} style={card.card}>
      <Flex justifyContent="space-between" direction="row" gap={4}>
        <Flex gap={3} flexDir="row" alignItems="center">
          <AvatarPlaceholder image={supervisorImage} name={supervisorName} size="lg" borderRadius={10} />
          <Box>
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {supervisorName.length > 30 ? supervisorName.split(" ")[0] : supervisorName}
            </Text>
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {supervisorPosition}
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Divider />

      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12} color="#3F434A">
            Phone:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <TouchableOpacity onPress={handleCallPress}>
              <Text fontWeight={400} fontSize={12} color="#8A9099">
                {supervisorPhone}
              </Text>
            </TouchableOpacity>
            {/* <Icon
              onPress={() => CopyToClipboard(supervisorPhone)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            /> */}
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12}>
            Email:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text onPress={() => CopyToClipboard(supervisorEmail)} fontWeight={400} fontSize={12} color="#8A9099">
              {supervisorEmail}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SupervisorInformation;
