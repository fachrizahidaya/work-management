import React from "react";

import { Box, Checkbox, Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useSelector } from "react-redux";

const ActiveTaskList = () => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <Flex
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      borderLeftWidth={3}
      borderColor="#ff965d"
      px={4}
    >
      <Flex flexDir="row" alignItems="center" h="100%" gap={3}>
        <Checkbox>
          <Flex flexDir="column">
            <Text opacity={0.5}>{userSelector.name}</Text>
            <Text>AxiosInstance reconfig for error</Text>
          </Flex>
        </Checkbox>
      </Flex>
      <Pressable>
        <Icon as={<MaterialIcons name="more-vert" />} size={6} mr={1} color="gray.600" />
      </Pressable>
    </Flex>
  );
};

export default ActiveTaskList;
