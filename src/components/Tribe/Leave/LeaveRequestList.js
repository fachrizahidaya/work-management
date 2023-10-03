import { Actionsheet, Badge, Box, Flex, Icon, Pressable, Text } from "native-base";

import dayjs from "dayjs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";

const LeaveRequestList = ({ id, leaveName, days, startDate, endDate, status, supervisorName, reason }) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);

  return (
    <>
      <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={5}>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize={14} color="#3F434A">
            {leaveName}
          </Text>
          <Pressable onPress={toggleAction}>
            <Icon as={<MaterialCommunityIcons name="dots-vertical" />} size="md" borderRadius="full" color="#000000" />
          </Pressable>
          <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
            <Actionsheet.Content>
              <Actionsheet.Item>Edit</Actionsheet.Item>
              <Actionsheet.Item>Delete</Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </Flex>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text color="#595F69" fontSize={12} fontWeight={400}>
              {reason}
            </Text>
          </Flex>
          <Badge borderRadius={10} w={20}>
            <Flex gap={2} flexDir="row">
              <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
              {days > 1 ? `${days} days` : `${days} day`}
            </Flex>
          </Badge>
        </Flex>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text color="#595F69" fontSize={12} fontWeight={400}>
            {dayjs(startDate).format("DD.MM.YYYY")} - {dayjs(endDate).format("DD.MM.YYYY")}
          </Text>
          <Text
            color={
              status === "Pending" ? "#F0C290" : status === "Declined" || status === "Canceled" ? "#FF6262" : "#437D96"
            }
          >
            {status}
          </Text>
        </Flex>
      </Box>
    </>
  );
};

export default LeaveRequestList;
