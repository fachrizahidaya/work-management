import { Actionsheet, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuAttachment = ({ isOpen, onClose }) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content gap={1}>
        <Actionsheet.Item backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
            <Text fontSize={16} fontWeight={400}>
              Document
            </Text>
            <Icon as={<MaterialCommunityIcons name="file-document-outline" />} color="#1E4AB9" />
          </Flex>
        </Actionsheet.Item>
        <Actionsheet.Item backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
            <Text fontSize={16} fontWeight={400}>
              Photos
            </Text>
            <Icon as={<MaterialCommunityIcons name="image-multiple-outline" />} color="#39B326" />
          </Flex>
        </Actionsheet.Item>
        <Actionsheet.Item backgroundColor="#F5F5F5">
          <Flex width={350} justifyContent="space-between" alignItems="center" flexDirection="row">
            <Text fontSize={16} fontWeight={400}>
              Project/Task
            </Text>
            <Icon as={<MaterialCommunityIcons name="circle-slice-2" />} color="#EB0E29" />
          </Flex>
        </Actionsheet.Item>
        <Actionsheet.Item mt={1} backgroundColor="#F5F5F5">
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
