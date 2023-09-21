import React from "react";

import { Actionsheet, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 *
 * @param {Node} children
 * @param {String} value
 * @param {Boolean} isOpen
 * @param {Function} toggle
 */
const CustomSelect = ({ children, value, isOpen, toggle, displayEmpty }) => {
  return (
    <>
      <Pressable onPress={toggle}>
        <Flex
          borderWidth={1}
          borderColor="#cbcbcb"
          borderRadius={15}
          py={1}
          px={3}
          bgColor={"#F8F8F8"}
          style={{ height: 40 }}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flexDir="row" alignItems="center" style={{ gap: 10 }}>
            <Text>{value}</Text>
          </Flex>

          <Icon as={<MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} />} size="md" />
        </Flex>
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={toggle}>
        <Actionsheet.Content>{children}</Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default CustomSelect;
