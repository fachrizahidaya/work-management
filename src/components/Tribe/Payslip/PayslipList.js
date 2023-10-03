import { Box, Flex, Icon, Pressable, Text } from "native-base";

import dayjs from "dayjs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PayslipList = ({ id, month, year }) => {
  return (
    <>
      <Flex
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderTopColor="#E8E9EB"
        borderTopWidth={1}
        py={3}
        px={4}
      >
        <Box>
          <Text fontWeight={500} fontSize={14} color="#3F434A">
            {dayjs()
              .month(month - 1)
              .year(year)
              .format("MMMM YYYY")}
          </Text>
          <Text fontSize={12} fontWeight={400} color="#595F69">
            {month === 1
              ? `22.0${month - 1}.${year - 1} - 21.0${month}.${year}`
              : `22.0${month - 1}.${year} - 21.0${month}.${year}`}
          </Text>
        </Box>

        <Pressable>
          <Icon as={<MaterialCommunityIcons name="tray-arrow-down" />} size={6} color="#186688" />
        </Pressable>
      </Flex>
    </>
  );
};

export default PayslipList;
