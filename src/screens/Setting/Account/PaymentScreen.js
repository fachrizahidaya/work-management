import { useNavigation } from "@react-navigation/native";

import { Box, Flex, Icon, Pressable, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PageHeader from "../../../components/shared/PageHeader";

const PaymentScreen = ({ route }) => {
  const { profile, editProfileHandler } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Pressable
            onPress={() =>
              navigation.navigate("Account Screen", { profile: profile, editProfileHandler: editProfileHandler })
            }
          >
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text fontSize={16}>Payments</Text>
        </Flex>
      </Flex>

      <Flex my={3} gap={11} px={5}>
        <Box width={250}>
          <Text color="#3F434A">redirect to website</Text>
        </Box>
      </Flex>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
