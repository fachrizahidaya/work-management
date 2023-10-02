import { Box, Divider, Flex, Icon, Pressable, Text } from "native-base";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";

const EmployeeInformation = ({ name, position, email, phone, image }) => {
  return (
    <Flex my={10} flexDir="column" gap={8} style={card.card}>
      <Flex justifyContent="space-between" direction="row" gap={4}>
        <Flex gap={3} flexDir="row">
          <AvatarPlaceholder image={image} name={name} size="md" />
          <Box>
            <Text fontWeight={500} fontSize="20px" color="#3F434A">
              {name.length > 30 ? name.split(" ")[0] : name}
            </Text>
            <Text fontWeight={400} fontSize="12px" color="#8A9099">
              {position}
            </Text>
          </Box>
        </Flex>
        <Box borderWidth={1} borderColor="#C6C9CC" borderRadius="full" width="30px" height="30px" padding={1.5}>
          <Pressable>
            <Icon as={<SimpleLineIcons name="pencil" />} size={4} color="black" />
          </Pressable>
        </Box>
      </Flex>

      <Divider />

      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize="12px" color="#3F434A">
            Phone:
          </Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099">
            {phone}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text>Email:</Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099">
            {email}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EmployeeInformation;
