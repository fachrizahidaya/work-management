import dayjs from "dayjs";

import { Badge, Flex, Icon, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";

const LeaveRequestItem = ({ id, leave_name, reason, days, begin_date, end_date, status, item, onSelect }) => {
  return (
    <Flex key={id} my={2} flexDir="column" style={card.card}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text fontWeight={500} fontSize={14} color="#3F434A">
          {leave_name}
        </Text>
        {status === "Pending" ? (
          <Pressable
            onPress={() => {
              onSelect(item);
            }}
          >
            <Icon as={<MaterialCommunityIcons name="dots-vertical" />} size="md" borderRadius="full" color="#000000" />
          </Pressable>
        ) : null}
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
          {dayjs(begin_date).format("DD.MM.YYYY")} - {dayjs(end_date).format("DD.MM.YYYY")}
        </Text>
        <Text color={"#FF6262"}>{status}</Text>
      </Flex>
    </Flex>
  );
};

export default LeaveRequestItem;
