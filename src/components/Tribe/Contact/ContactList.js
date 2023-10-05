import { useNavigation } from "@react-navigation/native";

import { Button, Flex, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ContactList = ({ id, name, position, division, status, image, phone, email }) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const navigation = useNavigation();

  return (
    <>
      <Flex my={2} flexDir="column" style={card.card}>
        <Flex alignItems="center" flexDir="row-reverse"></Flex>
        <Flex justifyContent="space-between" gap={3} flexDir="row" alignItems="center">
          <Flex flexDir="row" alignItems="center" gap={3}>
            <AvatarPlaceholder image={image} name={name} size="sm" borderRadius="full" />
            <Flex>
              <Text fontWeight={500} fontSize={12} color="#3F434A">
                {name.length > 30 ? name.split(" ")[0] : name}
              </Text>
              <Text fontWeight={400} fontSize={12} color="#20A144">
                {position}
              </Text>
            </Flex>
          </Flex>
          <Button onPress={() => navigation.navigate("Chat List")}>
            <Text color="#FFFFFF" fontSize={12} fontWeight={500}>
              Chat
            </Text>
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default ContactList;
