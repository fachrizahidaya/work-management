import { useNavigation } from "@react-navigation/native";

import { Box, Flex, Icon, Pressable, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PageHeader from "../../../components/shared/PageHeader";

const CompanyScreen = ({ route }) => {
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
          <Text fontSize={16}>Company</Text>
        </Flex>
      </Flex>

      <Flex my={3} gap={11} px={5}>
        <Box width={250}>
          <Text color="#3F434A">This account is under subscription of PT Kolabora Group Indonesia</Text>
        </Box>
        <Box width={300}>
          <Text color="#3F434A" fontWeight={700}>
            Address:
          </Text>
          <Text color="#3F434A">
            ONE PM Buildiing Level 5, Kav M5 17-18, Boulevard Gading Serpong, Tangerang, Banten, Indonesia, 15810
          </Text>
        </Box>
        <Box width={250}>
          <Text color="#3F434A" fontWeight={700}>
            Phone:
          </Text>
          <Text color="#3F434A">+62 21 588 8220</Text>
        </Box>
        <Box width={250}>
          <Text color="#3F434A" fontWeight={700}>
            Email:
          </Text>
          <Text>admin@kolabora.com</Text>
        </Box>
      </Flex>
    </SafeAreaView>
  );
};

export default CompanyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
