import { useState } from "react";
import Clipboard from "@react-native-clipboard/clipboard";

import { Box, Divider, Flex, Icon, Pressable, Text, Actionsheet, useDisclose, useToast } from "native-base";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";

const EmployeeInformation = ({ name, position, email, phone, image }) => {
  const { isOpen, onClose, onToggle, onOpen } = useDisclose();
  const toast = useToast();
  const [copyText, setCopyText] = useState(phone);

  const copyToClipboard = () => {
    try {
      Clipboard.setString(copyText);
      toast.show({ description: "Copied to clipboard" });
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
      toast.show({ description: "Phone is not available" });
    }
  };

  return (
    <Flex mt={3} gap={5} style={card.card}>
      <Flex justifyContent="space-between" direction="row" gap={4}>
        <Flex gap={3} flexDir="row" alignItems="center">
          <AvatarPlaceholder image={image} name={name} size="lg" borderRadius={10} />
          <Flex>
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {name.length > 30 ? name.split(" ")[0] : name}
            </Text>
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {position}
            </Text>
          </Flex>
        </Flex>

        <Pressable
          borderWidth={1}
          borderColor="#C6C9CC"
          borderRadius="full"
          width="30px"
          height="30px"
          alignItems="center"
          justifyContent="center"
          onPress={onOpen}
        >
          <Icon as={<SimpleLineIcons name="pencil" />} size={3} color="black" />
        </Pressable>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Actionsheet.Item>Edit</Actionsheet.Item>
            <Actionsheet.Item>Option 2</Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </Flex>

      <Divider />

      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12} color="#3F434A">
            Phone:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {phone}
            </Text>
            <Icon
              onPress={() => copyToClipboard()}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" flexDir="row">
          <Text fontWeight={400} fontSize={12}>
            Email:
          </Text>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {email}
            </Text>
            <Icon as={<MaterialCommunityIcons name="content-copy" />} size={3} color="#3F434A" />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EmployeeInformation;
