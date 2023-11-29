import { Actionsheet, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MenuAttachment = ({ isOpen, onClose }) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Actionsheet.Item borderWidth={1} justifyContent="space-between">
          <Text fontSize={16} fontWeight={400}>
            Document
          </Text>
          <Icon as={<MaterialCommunityIcons name="file-document-outline" />} color="#1E4AB9" />
          {/* <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          </Flex> */}
        </Actionsheet.Item>
        <Actionsheet.Item>Photos</Actionsheet.Item>
        <Actionsheet.Item>Project/Task</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default MenuAttachment;
