import { StyleSheet } from "react-native";
import { Box, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LeaveDashboardUser = ({ availableLeave, pendingApproval, approved }) => {
  const items = [
    {
      id: 1,
      name: "Available Leave",
      icon: "clipboard-outline",
      qty: availableLeave,
      backgroundColor: "#E8E9EB",
      iconColor: "#377893",
    },
    {
      id: 2,
      name: "Pending Approval",
      icon: "clipboard-pulse-outline",
      qty: pendingApproval,
      backgroundColor: "#FAF6E8",
      iconColor: "#FFD240",
    },
    {
      id: 3,
      name: "Approved",
      icon: "clipboard-check-outline",
      qty: approved,
      backgroundColor: "#E9F5EC",
      iconColor: "#49C96D",
    },
  ];

  return (
    <>
      <Flex gap={3} alignItems="center" justifyContent="center" flexDir="row">
        {items.map((item) => {
          return (
            <Box key={item.id} alignItems="center" justifyContent="center" gap={1}>
              <Box
                backgroundColor={item.backgroundColor}
                alignItems="center"
                justifyContent="center"
                width={60}
                height={60}
                borderRadius={15}
              >
                <Icon as={<MaterialCommunityIcons name={item.icon} />} size={10} color={item.iconColor} />
              </Box>
              <Text fontWeight={500} fontSize={20}>
                {item.qty}
              </Text>
              <Text width={20} height={10} fontWeight={400} fontSize={12} color="#8A9099" textAlign="center">
                {item.name}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

export default LeaveDashboardUser;
