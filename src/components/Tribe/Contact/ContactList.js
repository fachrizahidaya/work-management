import { useNavigation } from "@react-navigation/native";

import { Linking, TouchableOpacity } from "react-native";
import { Button, Flex, Icon, Image, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ContactList = ({ id, name, position, division, status, image, phone, email }) => {
  const navigation = useNavigation();

  const handleCallPress = () => {
    try {
      const phoneUrl = `tel:0${phone}`;
      Linking.openURL(phoneUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailPress = () => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleWhatsappPress = () => {
    try {
      const whatsappUrl = `whatsapp://send?phone=+62${phone}`;
      Linking.openURL(whatsappUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Flex my={2} flexDir="column" style={card.card}>
        <Flex justifyContent="space-between" gap={3} flexDir="row" alignItems="center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: id,
              })
            }
          >
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
          </TouchableOpacity>
          <Flex gap={2} flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={handleWhatsappPress}>
              <Icon as={<MaterialCommunityIcons name="whatsapp" />} size={5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmailPress}>
              <Icon as={<MaterialCommunityIcons name="email-outline" />} size={5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCallPress}>
              <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat List")}>
              <Image
                source={require("../../../assets/icons/nest_logo.png")}
                alt="nest"
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ContactList;
