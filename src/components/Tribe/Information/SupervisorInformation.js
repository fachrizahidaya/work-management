import { Box, Divider, Flex, Icon, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

import { card } from "../../../styles/Card";

const SupervisorInformation = ({
  supervisorName,
  supervisorEmail,
  supervisorPhone,
  supervisorImage,
  supervisorPosition,
}) => {
  return (
    <Flex flexDir="column" gap={8} style={card.card}>
      <Flex justifyContent="space-between" direction="row" gap={4}>
        <Flex gap={3} flexDir="row">
          <AvatarPlaceholder image={supervisorImage} name={supervisorName} size="md" />
          <Box>
            <Text fontWeight={500} fontSize="20px" color="#3F434A">
              {supervisorName.length > 30 ? supervisorName.split(" ")[0] : supervisorName}
            </Text>
            <Text fontWeight={400} fontSize="12px" color="#8A9099">
              {supervisorPosition}
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Divider />

      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize="12px" color="#3F434A">
            Phone:
          </Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099">
            {supervisorEmail}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text>Email:</Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099">
            {supervisorPhone}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SupervisorInformation;
