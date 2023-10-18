import { useNavigation } from "@react-navigation/native";

import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";

const AccountScreen = ({ route }) => {
  const { profile, editProfileHandler } = route.params;

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Pressable onPress={() => navigation.navigate("Setting")}>
            <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Text fontSize={16}>My</Text>
          <Text color="primary.600" fontWeight={700} fontSize={16}>
            KSS
          </Text>
          <Text fontSize={16}>Account</Text>
        </Flex>
      </Flex>

      <ScrollView>
        <Flex gap={1} alignItems="center" justifyContent="center" my={3}>
          <AvatarPlaceholder borderRadius="full" size="xl" name={profile?.data?.name} image={profile?.data?.image} />
          <Text fontSize={18} fontWeight={700}>
            {profile?.data?.name}
          </Text>
          <Text fontSize={10} fontWeight={400}>
            {profile?.data?.email}
          </Text>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
