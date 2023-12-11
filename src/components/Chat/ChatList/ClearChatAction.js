import { Actionsheet, Box, Flex, Icon, Spinner, Text } from "native-base";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ClearChatAction = ({ isOpen, onClose, name, clearChat, isLoading }) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content gap={1}>
        <Actionsheet.Item _pressed={{ backgroundColor: "#FFFFFF" }} mt={1}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex gap={3} flexDirection="row" alignItems="center" justifyContent="center" width={350}>
              <Text fontSize={16} fontWeight={700}>
                Clear all message from "{name}"?
              </Text>
            </Flex>
            <Icon onPress={onClose} as={<MaterialCommunityIcons name="close" />} />
          </Flex>
        </Actionsheet.Item>

        <Actionsheet.Item borderRadius={10} backgroundColor="#F5F5F5">
          <Flex width={350} flexDirection="row">
            <Text fontSize={16} fontWeight={400}>
              This chat will be empty but will remain in your chat list.
            </Text>
          </Flex>
        </Actionsheet.Item>

        <Actionsheet.Item onPress={clearChat} borderRadius={10} mt={1} backgroundColor="#F5F5F5">
          <Flex flexDir="row" alignItems="center" justifyContent="space-between" width={350}>
            <Text fontSize={16} fontWeight={400} color="#FF0303" textAlign={isLoading ? "center" : null}>
              {isLoading ? <Spinner color="primary.600" /> : "Clear All Messages"}
            </Text>
            <Icon onPress={onClose} as={<MaterialCommunityIcons name="trash-can" />} size={5} color="#FF0303" />
          </Flex>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ClearChatAction;
