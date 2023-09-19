import { Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import dayjs from "dayjs";

const PayslipList = ({ id, month, year }) => {
  return (
    <>
      <Flex
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomColor="#cbcbcb"
        borderTopWidth={1}
        borderTopColor="#cbcbcb"
        borderBottomWidth={1}
        py={2}
        px={4}
      >
        <Text fontWeight={500} fontSize="12px">
          {dayjs()
            .month(month - 1)
            .year(year)
            .format("MMMM YYYY")}
        </Text>

        <Icon as={<MaterialCommunityIcons name="download" />} size={8} color="#186688" />
      </Flex>
    </>
  );
};

export default PayslipList;
