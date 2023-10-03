import { Box, Divider, Flex, Icon, Pressable, Text, Actionsheet } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { card } from "../../../styles/Card";
import { useDisclosure } from "../../../hooks/useDisclosure";

const EmployeeInformation = ({ name, position, email, phone, image }) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);

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
          onPress={toggleAction}
        >
          <Icon as={<MaterialCommunityIcons name="pencil-outline" />} size={3} color="#000000" />
        </Pressable>
        <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
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
              onPress={() => CopyToClipboard(phone)}
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
            <Icon
              onPress={() => CopyToClipboard(email)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EmployeeInformation;
