import { useNavigation } from "@react-navigation/native";

import { Linking, TouchableOpacity } from "react-native";
import { Button, Flex, Icon, Image, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useDisclosure } from "../../../hooks/useDisclosure";
import EmailButton from "../../shared/EmailButton";
import PhoneButton from "../../shared/PhoneButton";
import WhatsappButton from "../../shared/WhatsappButton";
import PersonalNestButton from "../../shared/PersonalNestButton";

const ContactList = ({ id, name, position, division, status, image, phone, email }) => {
  const navigation = useNavigation();

  return (
    <>
      <Flex my={2} flexDir="column" style={card.card}>
        <Flex justifyContent="space-between" gap={3} flexDir="row" alignItems="center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Employee Profile", {
                employeeId: id,
                returnPage: "Contact",
              })
            }
          >
            <Flex flexDir="row" alignItems="center" gap={3}>
              <AvatarPlaceholder image={image} name={name} size="sm" borderRadius="full" isThumb={false} />
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
            <WhatsappButton phone={phone} size={5} />
            <EmailButton email={email} size={5} />
            <PhoneButton phone={phone} size={5} />
            <PersonalNestButton />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ContactList;
