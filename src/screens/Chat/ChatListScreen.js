import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Box, Center, Flex, Icon, Image, Input, Pressable, Skeleton, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const users = [
    { id: 17, name: "Huda Azzuhri" },
    { id: 27, name: "Bryan Wangsa" },
    { id: 25, name: "Indra Oei" },
    { id: 68, name: "Fachriza" },
    { id: 7, name: "Jeremy Gerald" },
  ];

  const teams = [
    {
      username: "Tech Team",
      image: "https://avatars.githubusercontent.com/u/9055180?s=80&v=4",
      chat: "Hey wanna hang out?",
    },
    {
      username: "Developers",
      image: "https://avatars.githubusercontent.com/u/11680611?s=80&v=4",
      chat: "You wont believe what Susan just told me!",
    },
    {
      username: "Designers",
      image: "https://avatars.githubusercontent.com/u/3666047?v=4",
      chat: "Yoo.. have you tried the new Starbucks coffee?",
    },
  ];

  const isReady = false;
  return isReady ? (
    <Box bgColor="white" flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box p={4}>
          <Input
            variant="unstyled"
            size="lg"
            InputLeftElement={
              <Pressable>
                <Icon as={<MaterialIcons name="search" />} size="lg" ml={2} color="muted.400" />
              </Pressable>
            }
            placeholder="Search..."
            borderColor="white"
            bgColor="#F8F8F8"
            borderRadius={15}
            style={{ height: 40 }}
          />
        </Box>

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            TEAMS
          </Text>

          <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </Box>
        </Flex>
        {teams.length > 0 &&
          teams.map((team, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  navigation.navigate("Chat Room", { name: team.username, image: team.image });
                }}
              >
                <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
                  <Flex flexDir="row" gap={4} alignItems="center">
                    {isLoading ? (
                      <Skeleton h={12} w={12} rounded="full" />
                    ) : (
                      <Avatar size="md" source={{ uri: team.image }}>
                        SS
                        {team.username === "Tech Team" && <Avatar.Badge bg="green.500" />}
                      </Avatar>
                    )}

                    <Box>
                      {isLoading ? (
                        <Skeleton h={3} w={20} rounded="full" />
                      ) : (
                        <Text fontSize={16}>#{team.username}</Text>
                      )}
                      <Flex flexDir="row" alignItems="center" gap={1}>
                        {isLoading ? (
                          <Skeleton h={3} w={"48"} rounded="full" mt={1} />
                        ) : (
                          <Text opacity={0.5}>
                            {team.chat.length > 35 ? team.chat.slice(0, 35) + "..." : team.chat}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
              </Pressable>
            );
          })}

        {/* ==================================================================== */}

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            PEOPLE
          </Text>

          <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </Box>
        </Flex>
        {users.length > 0 &&
          users.map((user, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  navigation.navigate("Chat Room", { name: user.name, userId: user.id, image: "" });
                }}
              >
                <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
                  <Flex flexDir="row" gap={4} alignItems="center">
                    {isLoading ? (
                      <Skeleton h={12} w={12} rounded="full" />
                    ) : (
                      <AvatarPlaceholder name={user.name} size="md" />
                    )}

                    <Box>
                      {isLoading ? <Skeleton h={3} w={20} rounded="full" /> : <Text fontSize={16}>{user.name}</Text>}
                      <Flex flexDir="row" alignItems="center" gap={1}>
                        {isLoading ? (
                          <Skeleton h={3} w={"48"} rounded="full" mt={1} />
                        ) : (
                          <Text opacity={0.5}>
                            {user?.chat?.length > 35 ? user?.chat.slice(0, 35) + "..." : user.chat}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
              </Pressable>
            );
          })}
      </ScrollView>
    </Box>
  ) : (
    <Center flex={1} bgColor="white">
      <Image source={require("../../assets/vectors/chat.jpg")} alt="chat-app" h={180} w={250} resizeMode="contain" />
      <Text fontSize={22}>This feature is coming soon!</Text>
    </Center>
  );
};

export default ChatListScreen;
