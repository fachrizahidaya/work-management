import dayjs from "dayjs";
import { Badge, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LeaveRequestList = ({ id, leaveName, days, startDate, endDate, status, supervisorName, reason }) => {
  return (
    <>
      <Box gap={1} borderBottomColor="#cbcbcb" borderBottomWidth={1} py={2} px={4}>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize="12px">
            {leaveName}
          </Text>
        </Flex>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text fontWeight={500} fontSize="12px">
            {reason}
          </Text>
          <Badge borderRadius={15}>
            <Flex gap={2} flexDir="row">
              <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
              {days > 1 ? `${days} days` : `${days} day`}
            </Flex>
          </Badge>
        </Flex>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text>
            {dayjs(startDate).format("DD.MM.YYYY")}-{dayjs(endDate).format("DD.MM.YYYY")}
          </Text>
          <Text color={status === "Pending" ? "#F0C290" : status === "Declined" ? "#FF6262" : "#437D96"}>{status}</Text>
        </Flex>
      </Box>
    </>
  );
};

export default LeaveRequestList;
