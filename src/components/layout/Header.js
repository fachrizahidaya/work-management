import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView } from "react-native";
import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../shared/AvatarPlaceholder";
import { useFetch } from "../../hooks/useFetch";

const Header = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const { data: myProfile } = useFetch("/hr/my-profile");

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <Flex
        direction="row"
        bg="#fff"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="#E8E9EB"
      >
        <Flex direction="row" alignItems="center" gap={2}>
          <AvatarPlaceholder size="md" image={userSelector.image} name={userSelector.name} />

          <Box>
            <Text fontWeight={700} fontSize={18} lineHeight={24}>
              {userSelector.name.length > 30 ? userSelector.split(" ")[0] : userSelector.name}
            </Text>

            {myProfile?.data && (
              <Text fontSize={12} fontWeight={400}>
                {myProfile.data.position_name || "You have no position"}
              </Text>
            )}
          </Box>
        </Flex>

        <Flex direction="row" gap={8}>
          <Pressable>
            <Icon
              as={<MaterialCommunityIcons name="bell-outline" />}
              style={{ height: 22, width: 22 }}
              color="#3f434b"
            />
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Chat List")}>
            <Icon
              as={<MaterialCommunityIcons name="message-text-outline" />}
              style={{ height: 22, width: 22 }}
              color="#3f434b"
            />
          </Pressable>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

export { Header };
