import { Actionsheet, Badge, Box, Button, Flex, Icon, Pressable, Text, useDisclose } from "native-base";

import dayjs from "dayjs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TeamLeaveRequestList = ({ id, name, leaveName, days, startDate, endDate, status, reason }) => {
  const { isOpen, onClose, onOpen } = useDisclose();

  // Canceled status not appeared in team leace request
  return status === "Canceled" ? null : (
    <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={5}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex flex={1} flexDir="row">
          <Text fontWeight={500} fontSize={14} color="#3F434A">
            {leaveName}
          </Text>{" "}
          |{" "}
          <Text fontWeight={500} fontSize={14} color="#377893">
            {name}
          </Text>
        </Flex>
        <Pressable onPress={onOpen}>
          <Icon as={<MaterialCommunityIcons name="dots-vertical" />} size="md" borderRadius="full" color="#000000" />
        </Pressable>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
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
        {status === "Pending" ? (
          <Flex gap={1} flexDir="row">
            <Button size="xs" bgColor="#FF6262">
              Decline
            </Button>
            <Button size="xs" bgColor="#377893">
              Approve
            </Button>
          </Flex>
        ) : (
          <Text color={status === "Rejected" || status === "Canceled" ? "#FF6262" : "#437D96"}>{status}</Text>
        )}
      </Flex>
    </Box>
  );
};

export default TeamLeaveRequestList;
