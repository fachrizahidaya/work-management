import React from "react";

import { Flex, HStack, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../../shared/AvatarPlaceholder";

const AdditionAndResponsibleSection = ({
  image,
  totalAttachments,
  totalChecklists,
  totalChecklistsDone,
  totalComments,
  responsible,
}) => {
  return (
    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
      <HStack space={5}>
        {totalAttachments > 0 && (
          <Flex flexDir="row" alignItems="center" gap={1}>
            <Icon
              as={<MaterialCommunityIcons name="attachment" />}
              size="sm"
              style={{ transform: [{ rotate: "-35deg" }] }}
            />
            <Text fontWeight={400}>{totalAttachments || 0}</Text>
          </Flex>
        )}

        {totalComments > 0 && (
          <Flex flexDir="row" alignItems="center" gap={1}>
            <Icon as={<MaterialCommunityIcons name="message-text-outline" />} size="sm" />
            <Text fontWeight={400}>{totalComments || 0}</Text>
          </Flex>
        )}

        {totalChecklists > 0 && (
          <Flex flexDir="row" alignItems="center" gap={1}>
            <Icon as={<MaterialCommunityIcons name="checkbox-marked-outline" />} size="sm" />
            <Text fontWeight={400}>
              {totalChecklistsDone || 0} / {totalChecklists || 0}
            </Text>
          </Flex>
        )}
      </HStack>

      <Flex flexDir="row" alignItems="center" gap={2}>
        {responsible && <AvatarPlaceholder image={image} name={responsible} />}
      </Flex>
    </Flex>
  );
};

export default AdditionAndResponsibleSection;
