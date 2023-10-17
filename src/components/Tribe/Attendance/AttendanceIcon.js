import { Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttendanceIcon = () => {
  const listIcons = [
    { key: "allGood", color: "#EDEDED", name: "All Good" },
    { key: "reportRequired", color: "#FDC500", name: "Report Required" },
    { key: "submittedReport", color: "#186688", name: "Submitted Report" },
    { key: "dayOff", color: "#3bc14a", name: "Day-off" },
    { key: "sick", color: "#000000", name: "Sick" },
  ];

  return (
    <Flex alignItems="center" justifyContent="center" gap={1} px={3} flexDirection="row" flexWrap="wrap">
      {listIcons.slice(0, 4).map((item) => {
        return (
          <Flex flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
            <Icon as={<MaterialCommunityIcons name="circle" />} color={item.color} />
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
