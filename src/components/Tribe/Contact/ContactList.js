import { Badge, Flex, Icon, IconButton, Input, Menu, Pressable, Text, Actionsheet, useDisclose } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useNavigation } from "@react-navigation/native";

const ContactList = ({ id, name, position, division, status, image, phone, email }) => {
  const { isOpen, onClose, onOpen } = useDisclose();
  const navigation = useNavigation();
  return (
    <>
      <Flex my={3} flexDir="column" style={card.card}>
        <Flex alignItems="center" flexDir="row-reverse">
          <Pressable onPress={onOpen}>
            <Icon as={<MaterialCommunityIcons name="dots-vertical" />} size="md" borderRadius="full" color="black" />
          </Pressable>
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Actionsheet.Item>Option 1</Actionsheet.Item>
              <Actionsheet.Item>Option 2</Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </Flex>
        <Flex gap={3} alignItems="center">
          <AvatarPlaceholder image={image} name={name} size="2xl" borderRadius={30} />
          <Text fontWeight={500} fontSize={20} color="#3F434A">
            {name.length > 30 ? name.split(" ")[0] : name}
          </Text>
          <Badge borderRadius={10}>
            <Text fontWeight={400} fontSize={16} color="#20A144">
              {position}
            </Text>
          </Badge>
          <Text fontWeight={400} fontSize={12} color="#8A9099">
            {email}
          </Text>
          <Text fontWeight={400} fontSize={12} color="#8A9099">
            {phone}
          </Text>
        </Flex>

        <Flex mt={5} alignItems="center" gap={20} justifyContent="center" flexDir="row">
          <Text fontWeight={500} fontSize={14} color="#595F69">
            Profile
          </Text>
          <Pressable onPress={() => navigation.navigate("Chat List")}>
            <Text fontWeight={500} fontSize={14} color="#595F69">
              Message
            </Text>
          </Pressable>
        </Flex>
      </Flex>
    </>
  );
};

export default ContactList;
