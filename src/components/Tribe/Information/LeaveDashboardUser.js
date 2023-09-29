import { StyleSheet } from "react-native";
import { Box, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LeaveDashboardUser = ({ availableLeave, pendingApproval, approved }) => {
  return (
    <>
      <Flex style={styles.container}>
        <Flex gap={1} height="110px" width="60px">
          <Box
            flex={1}
            minHeight="60px"
            borderRadius={15}
            backgroundColor="#E8E9EB"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={<MaterialCommunityIcons name="clipboard-outline" />} color="#377893" size={30} />
          </Box>
          <Text fontWeight={500} fontSize="20px" color="#3F434A" textAlign="center">
            {availableLeave}
          </Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099" textAlign="center">
            Available Leave
          </Text>
        </Flex>
        <Flex gap={1} height="110px" width="60px">
          <Box
            flex={1}
            borderRadius={15}
            minHeight="60px"
            backgroundColor="#FAF6E8"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={<MaterialCommunityIcons name="clipboard-pulse-outline" />} color="#FFD240" size={30} />
          </Box>
          <Text fontWeight={500} fontSize="20px" color="#3F434A" textAlign="center">
            {pendingApproval}
          </Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099" textAlign="center">
            Pending Approval
          </Text>
        </Flex>
        <Flex gap={1} height="110px" width="60px">
          <Box
            flex={1}
            borderRadius={15}
            minHeight="60px"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#E9f5EC"
          >
            <Icon as={<MaterialCommunityIcons name="clipboard-check-outline" />} color="#49C96D" size={30} />
          </Box>
          <Text fontWeight={500} fontSize="20px" color="#3F434A" textAlign="center">
            {approved}
          </Text>
          <Text fontWeight={400} fontSize="12px" color="#8A9099" textAlign="center">
            Approved
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});

export default LeaveDashboardUser;
