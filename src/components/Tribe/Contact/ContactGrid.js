import { useNavigation } from "@react-navigation/native";

import { Badge, Flex, Icon, Pressable, Text, Actionsheet } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { Linking, TouchableOpacity } from "react-native";

const ContactGrid = ({ id, name, position, division, status, image, phone, email }) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const navigation = useNavigation();

  const handleCallPress = () => {
    const phoneUrl = `tel:0${phone}`;
    Linking.openURL(phoneUrl).catch((err) => console.log(err));
  };

  const handleEmailPress = () => {
    const emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl)
      .then(() => console.log("Success to email"))
      .catch((err) => console.log(err));
  };

  const handleWhatsappPress = () => {
    const whatsappUrl = `whatsapp://send?phone=+62${phone}`;
    Linking.openURL(whatsappUrl)
      .then(() => console.log("Success to Whatsapp"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Flex my={3} flexDir="column" style={card.card}>
        <Flex alignItems="center" flexDir="row-reverse"></Flex>
        <Flex gap={3} alignItems="center">
          <AvatarPlaceholder image={image} name={name} size="2xl" borderRadius="full" />
          <Text fontWeight={500} fontSize={20} color="#3F434A">
            {name.length > 30 ? name.split(" ")[0] : name}
          </Text>
          <Badge borderRadius={10}>
            <Text fontWeight={400} fontSize={16} color="#20A144">
              {position}
            </Text>
          </Badge>
          <Flex gap={1} alignItems="center" flexDir="row">
            <TouchableOpacity onPress={handleEmailPress}>
              <Text fontWeight={400} fontSize={12} color="#8A9099">
                {email}
              </Text>
            </TouchableOpacity>

            <Icon
              onPress={() => CopyToClipboard(email)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
          <Flex gap={1} alignItems="center" flexDir="row">
            <TouchableOpacity onPress={handleCallPress}>
              <Text fontWeight={400} fontSize={12} color="#8A9099">
                {phone}
              </Text>
            </TouchableOpacity>
            <Icon
              onPress={() => CopyToClipboard(phone)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>

        <Flex mt={5} alignItems="center" gap={20} justifyContent="center" flexDir="row">
          <Pressable
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: id,
              })
            }
          >
            <Text fontWeight={500} fontSize={14} color="#595F69">
              Profile
            </Text>
          </Pressable>
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

export default ContactGrid;
