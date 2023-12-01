import { Actionsheet, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuAttachment = ({ isOpen, onClose, selectFile, pickImageHandler, selectBandHandler }) => {
  const attachmentOptions = [
    {
      icon: "file-document-outline",
      name: "Document",
      color: "#1E4AB9",
      onPress: () => {
        selectFile();
        onClose();
      },
    },
    {
      icon: "image-multiple-outline",
      name: "Photo",
      color: "#39B326",
      onPress: () => {
        pickImageHandler();
        onClose();
      },
    },
    {
      icon: "circle-slice-2",
      name: "Project/Task",
      color: "#EB0E29",
      onPress: () => {
        selectBandHandler("project");
        onClose();
      },
    },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content gap={1}>
        {attachmentOptions.map((option, index) => {
          return (
            <Actionsheet.Item key={index} onPress={option.onPress} backgroundColor="#F5F5F5">
              <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
                <Text fontSize={16} fontWeight={400}>
                  {option.name}
                </Text>
                <Icon as={<MaterialCommunityIcons name={option.icon} />} color={option.color} />
              </Flex>
            </Actionsheet.Item>
          );
        })}

        <Actionsheet.Item onPress={onClose} mt={1} backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="center" alignItems="center">
            <Text fontSize={16} fontWeight={400} color="#176688">
              Cancel
            </Text>
          </Flex>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default MenuAttachment;
