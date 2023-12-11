import { useNavigation } from "@react-navigation/native";
import { Button, Flex, Icon, Image, Modal, Text, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ContactInformation = ({
  isOpen,
  toggle,
  userId,
  roomId,
  name,
  file_path,
  position,
  email,
  type,
  active_member,
  isPinned,
}) => {
  const navigation = useNavigation();
  return (
    <Modal isOpen={isOpen} onClose={toggle} size="lg">
      <Modal.Content>
        <Modal.Body bgColor="white">
          <Text>{name}</Text>
          <VStack mt={3} alignItems="center">
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
              alt="confirmation"
              resizeMode="contain"
              h={200}
              w={300}
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer display="flex" flexDirection="row" justifyContent="space-evenly" bgColor="white">
          <Icon
            onPress={() => {
              navigation.navigate("Chat Room", {
                userId: userId,
                name: name,
                roomId: roomId,
                image: file_path,
                position: position,
                email: email,
                type: type,
                active_member: active_member,
                isPinned: isPinned,
              });
              toggle();
            }}
            as={<MaterialCommunityIcons name="android-messages" />}
            size={6}
          />
          <Icon as={<MaterialCommunityIcons name="information-outline" />} size={6} />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ContactInformation;
