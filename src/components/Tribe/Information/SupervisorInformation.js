import { Box, Divider, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {supervisorPhone}
            </Text>
            <Icon
              onPress={() => CopyToClipboard(supervisorPhone)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12}>
            Email:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {supervisorEmail}
            </Text>
            <Icon
              onPress={() => CopyToClipboard(supervisorEmail)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SupervisorInformation;
