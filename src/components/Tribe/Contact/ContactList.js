import { Box, Divider, Flex, Icon, Input, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import Ionicons from "react-native-vector-icons/Ionicons";

const ContactList = ({ id, name, position, division, status, image, phone, email }) => {
  return (
    <>
      <Flex my={5} flexDir="column" gap={8} style={card.card}>
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
              <Text fontWeight={400} fontSize="12px" color="#8A9099">
                {division}
              </Text>
            </Box>
          </Flex>

          <Pressable>
            <Icon as={<Ionicons name="chatbubble-ellipses-outline" />} size={7} color="black" />
          </Pressable>
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
    </>
  );
};

export default ContactList;
