import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView } from "react-native";
import { Avatar, Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Header = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);

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
          <Avatar
            source={{
              uri: `https://dev.kolabora-app.com/api-dev/image/${userSelector.image}/thumb`,
            }}
            size="md"
            bgColor="transparent"
          >
            KSS
          </Avatar>
          <Box>
            <Text fontWeight={700} fontSize={16} lineHeight={24}>
              {userSelector.name.length > 30 ? userSelector.split(" ")[0] : userSelector.name}
            </Text>

            <Text fontSize={10} fontWeight={400}>
              {userSelector.user_type}
            </Text>
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
