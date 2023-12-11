import { memo } from "react";

import dayjs from "dayjs";

import { Box, Flex, Icon, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../styles/Card";

const PayslipList = ({ id, month, year, openSelectedPayslip }) => {
  return (
    <Flex mx={3} my={2} flexDir="column" style={card.card}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text fontWeight={500} fontSize={14} color="#3F434A">
          {dayjs()
            .month(month - 1)
            .year(year)
            .format("MMMM YYYY")}
        </Text>

        <Pressable onPress={() => openSelectedPayslip(id)}>
          <Icon as={<MaterialCommunityIcons name="tray-arrow-down" />} size={6} color="#186688" />
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default memo(PayslipList);
