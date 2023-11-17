import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Button, Flex, Icon, Image, Pressable, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import Options from "../../../components/Setting/Account/Options";

const AccountScreen = ({ route }) => {
  const { profile } = route.params;

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Pressable onPress={() => navigation.goBack()}>
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
          <AvatarPlaceholder
            borderRadius="full"
            size="xl"
            name={userSelector?.name}
            image={userSelector?.image}
            isThumb={false}
          />
          <Text fontSize={20} fontWeight={700}>
            {userSelector?.name}
          </Text>
          <Text fontSize={12} fontWeight={400}>
            {profile?.data?.email}
          </Text>
        </Flex>
        <Flex bgColor="white" p={5} pb={10} gap={33}>
          <Options profile={profile} />

          <Pressable
            display="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            bgColor="#FAFAFA"
            borderRadius={9}
            h={42}
            p="8px 12px"
            opacity={0.5}
          >
            <Flex flexDir="row" alignItems="center" gap={4}>
              <Flex flexDirection="row" gap={1}>
                <Text fontSize={14} fontWeight={400} color="primary.600" bold>
                  KSS
                </Text>
                <Text fontSize={14} fontWeight={400}>
                  Drive |{" "}
                </Text>
                <Text fontSize={14} fontWeight={400} color="primary.600">
                  2 TB
                </Text>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="center" flexDir="row">
              <Text fontSize={14} fontWeight={400} color="primary.600">
                Upgrade
              </Text>
              <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
            </Flex>
          </Pressable>

          <Button onPress={() => navigation.navigate("Log Out")} bgColor="#FAFAFA" borderRadius={9}>
            <Text color="#FF6262" bold>
              Log out
            </Text>
          </Button>
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
