import React from "react";

import { Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDisclosure } from "../../hooks/useDisclosure";

const CustomAccordion = ({ children, title, subTitle, hasAction }) => {
  const { isOpen, toggle } = useDisclosure(true);

  return (
    <Flex gap={15}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex>
          <Pressable flexDir="row" gap={1} onPress={toggle}>
            <Icon as={<MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} />} size="md" />
            <Text>{title}</Text>
            <Text color="#8A9099">({subTitle})</Text>
          </Pressable>
        </Flex>

        {hasAction && (
          <Pressable>
            <Icon as={<MaterialCommunityIcons name="dots-horizontal" />} size="md" />
          </Pressable>
        )}
      </Flex>

      {isOpen && children}
    </Flex>
  );
};

export default CustomAccordion;
