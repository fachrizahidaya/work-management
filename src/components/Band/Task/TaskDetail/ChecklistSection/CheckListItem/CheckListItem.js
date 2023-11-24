import React from "react";

import { Flex, HStack, Icon, IconButton, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CheckListItem = ({ id, title, status, onPress, onPressDelete, disabled }) => {
  return (
    <Flex flexDir="row" justifyContent="space-between" alignItems="center" mb={2}>
      <HStack space={3} alignItems="center">
        <IconButton
          rounded="full"
          disabled={disabled}
          onPress={() => onPress(id, status)}
          icon={
            <Icon
              as={
                <MaterialCommunityIcons
                  name={status === "Open" ? "checkbox-blank-circle-outline" : "checkbox-marked-circle-outline"}
                />
              }
              color={status === "Finish" && "primary.600"}
            />
          }
          size="md"
        />

        <Text textDecorationLine={status === "Finish" ? "line-through" : "none"}>{title}</Text>
      </HStack>

      {!disabled && (
        <IconButton
          onPress={() => onPressDelete(id)}
          rounded="full"
          icon={<Icon as={<MaterialCommunityIcons name="delete-outline" />} size="md" color="gray.600" />}
        />
      )}
    </Flex>
  );
};

export default CheckListItem;
