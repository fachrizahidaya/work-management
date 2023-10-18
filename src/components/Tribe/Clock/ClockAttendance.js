import { Box, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ClockAttendance = ({ attendance, item, currentTime, attendanceCheckHandler }) => {
  return (
    <Flex
      flexDir="row"
      bg={!attendance?.time_in ? "#daecfc" : "#feedaf"}
      borderRadius={5}
      style={{ height: 32, width: 352 }}
      alignItems="center"
    >
      <Box px={1}>
        <Icon
          as={<MaterialCommunityIcons name={item.icons} />}
          size={6}
          color={!attendance?.time_in ? "#2984c3" : "#fdc500"}
        />
      </Box>
      {!attendance?.time_in ? (
        <Text fontWeight={700} color="#2984c3" mx={5}>
          Clock in
        </Text>
      ) : (
        <Text fontWeight={700} color="#fdc500" mx={5}>
          Clock out
        </Text>
      )}

      <Text ml={170} color={!attendance?.time_in ? "#2984c3" : "#fdc500"}>
        {currentTime}
      </Text>
    </Flex>
  );
};

export default ClockAttendance;
