import { Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttendanceIcon = () => {
  const listIcons = [
    { key: "allGood", color: "#EDEDED", name: "All Good" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off" },
    { key: "sick", color: "red.600", name: "Sick" },
  ];

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" gap={1} px={3} flexDirection="row" flexWrap="wrap">
      {listIcons.map((item) => {
        return (
          <Flex key={item?.key} flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
            <Icon as={<MaterialCommunityIcons name="circle" />} color={item.color} size={6} />
            <Text fontSize={12} fontWeight={500}>
              {item.name}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default AttendanceIcon;
