import React from "react";

import { Avatar, Divider, Flex, HStack, Icon, IconButton, Image, Menu, Text, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";

const MemberListItem = ({
  member,
  name,
  image,
  email,
  totalProjects,
  totalTasks,
  master,
  loggedInUser,
  openRemoveMemberModal,
}) => {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const userInitialGenerator = () => {
    const nameArray = name?.split(" ");
    let alias = "";

    if (nameArray?.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return (
    <Flex style={styles.card} gap={23}>
      <HStack alignItems="center" space={2} position="relative">
        {image ? (
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${image}` }}
            h={63}
            w={63}
            borderRadius={20}
            alt={`${name} avatar`}
          />
        ) : (
          <Avatar h={63} w={63} bgColor={stringToColor(name)} borderRadius={20}>
            {userInitialGenerator()}
          </Avatar>
        )}

        <VStack>
          <Text w={125} numberOfLines={2}>
            {name}
          </Text>

          {master === name && (
            <Icon as={<MaterialCommunityIcons name="shield-account-variant" />} size="lg" color="yellow.400" />
          )}
        </VStack>

        <HStack position="absolute" bottom={0} right={0} space={2}>
          <VStack alignItems="center">
            <Text opacity={0.5}>Task</Text>
            <Text>{totalTasks}</Text>
          </VStack>
          <Divider orientation="vertical" />
          <VStack alignItems="center">
            <Text opacity={0.5}>Project</Text>
            <Text>{totalProjects}</Text>
          </VStack>
        </HStack>
      </HStack>

      <Divider orientation="horizontal" bgColor="#E8E9EB" />

      <VStack space={2}>
        <Flex flexDir="row" justifyContent="space-between">
          <Text>Email:</Text>
          <Text>{email}</Text>
        </Flex>

        {loggedInUser === master && (
          <>
            {name !== master && (
              <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                <Text>Action:</Text>

                <Menu
                  trigger={(triggerProps) => {
                    return (
                      <IconButton
                        borderRadius="full"
                        {...triggerProps}
                        icon={<Icon as={<MaterialCommunityIcons name="dots-horizontal" />} color="black" />}
                      />
                    );
                  }}
                >
                  <Menu.Item onPress={() => openRemoveMemberModal(member)}>
                    <Flex flexDir="row" alignItems="center" gap={2}>
                      <Icon as={<MaterialCommunityIcons name="account-remove-outline" />} size="md" color="red.600" />
                      <Text color="red.600">Remove Member</Text>
                    </Flex>
                  </Menu.Item>
                </Menu>
              </Flex>
            )}
          </>
        )}
      </VStack>
    </Flex>
  );
};

export default MemberListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
});
