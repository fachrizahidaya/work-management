import React from "react";

import { Badge, Box, Flex, Icon, Pressable, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import ConfirmationModal from "../../components/shared/ConfirmationModal";

const UserDetail = () => {
  const route = useRoute();
  const { navigation, name, image, position, email, type, selectedGroupMembers, loggedInUser } = route.params;

  return (
    <>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text>{type === "personal" ? "Contact Detail" : "Group Detail"}</Text>
        </Flex>
      </Flex>
      <Flex gap={2} flex={1} bg="#FAFAFA" position="relative">
        <Flex pb={2} gap={2} bg="#FFFFFF" alignItems="center" justifyContent="center">
          <AvatarPlaceholder size="2xl" name={name} image={image} />
          <Text fontSize={16} fontWeight={500}>
            {name}
          </Text>
          {type === "personal " ? (
            <Box alignItems="center">
              <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
                {position}
              </Text>
              <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
                {email}
              </Text>
            </Box>
          ) : null}
        </Flex>
        <Flex px={16} py={2} gap={2} bg="#FFFFFF">
          <Box gap={2}>
            <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
              {type === "personal" ? "Status" : "Group participant"}
            </Text>
            {type === "personal" ? (
              <Text fontSize={12} fontWeight={400}>
                Active
              </Text>
            ) : (
              <Flex gap={2} flexDirection="row" flexWrap="wrap" alignItems="center">
                {selectedGroupMembers.map((member, index) => {
                  return (
                    <Badge borderRadius={15}>
                      <Flex gap={2} alignItems="center" flexDirection="row">
                        <AvatarPlaceholder name={member?.user?.name} image={member?.user?.image} />
                        {loggedInUser === member?.user?.id ? "You" : member?.user?.name}
                        {member?.is_admin ? (
                          <Badge borderRadius={15} colorScheme="#186688">
                            Admin
                          </Badge>
                        ) : null}
                      </Flex>
                    </Badge>
                  );
                })}
                <Badge borderRadius="full">
                  <Icon as={<MaterialIcons name={"add"} />} size={5} />
                </Badge>
              </Flex>
            )}
          </Box>
        </Flex>
        <Flex flex={1} px={16} py={2} gap={2} bg="#FFFFFF">
          <Pressable display="flex" gap={2} flexDirection="row" alignItems="center">
            <Icon as={<MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} />} size={5} />
            <Text fontSize={14} fontWeight={400}>
              {type === "personal" ? "Delete Chat" : "Exit Group"}
            </Text>
          </Pressable>
        </Flex>
      </Flex>
    </>
  );
};

export default UserDetail;
