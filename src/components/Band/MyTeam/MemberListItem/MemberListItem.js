import React from "react";

import { Divider, Flex, HStack, Image, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

const MemberListItem = ({ id, name, image, email, totalProjects, totalTasks }) => {
  return (
    <Flex style={styles.card} gap={23}>
      <HStack alignItems="center" space={2} position="relative">
        <Image
          source={{ uri: `https://dev.kolabora-app.com/api-dev/image/${image}` }}
          h={63}
          w={63}
          borderRadius={20}
          alt={`${name} avatar`}
        />

        <Text w={125} numberOfLines={2}>
          {name}
        </Text>

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
          <Text>Location:</Text>
          <Text>Indonesia</Text>
        </Flex>

        <Flex flexDir="row" justifyContent="space-between">
          <Text>Email:</Text>
          <Text>{email}</Text>
        </Flex>
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
    height: 200,
  },
});
