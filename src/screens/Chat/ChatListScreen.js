import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Box, Flex, Icon, Input, Pressable, Skeleton, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const friends = [
    {
      username: "Mark Zuckerberg",
      image: "https://cdn.britannica.com/99/236599-050-1199AD2C/Mark-Zuckerberg-2019.jpg",
      chat: "Hey wanna hang out?",
    },
    {
      username: "Bill Gates",
      image:
        "https://imageio.forbes.com/specials-images/imageserve/62d599ede3ff49f348f9b9b4/0x0.jpg?format=jpg&crop=821,821,x155,y340,safe&height=416&width=416&fit=bounds",
      chat: "You wont believe what Susan just told me!",
    },
    {
      username: "Mark Cuban",
      image:
        "https://cdn1.edgedatg.com/aws/v2/abc/SharkTank/person/942357/9828d1c422a22d1366a05121fcf78eef/528x528-Q90_9828d1c422a22d1366a05121fcf78eef.jpg",
      chat: "Yoo.. have you tried the new Starbucks coffee?",
    },
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
  return (
    <Box bgColor="white" flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          display="flex"
          flexDir="row"
          alignItems="center"
          gap={2}
          px={4}
          pt={4}
          onPress={() => navigation.goBack()}
        >
          <Icon as={<MaterialIcons name="keyboard-backspace" />} size="lg" color="black" />

          <Text fontSize={16}>Back</Text>
        </Pressable>

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
        {friends.length > 0 &&
          friends.map((friend, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  navigation.navigate("Chat Room", { name: friend.username, image: friend.image });
                }}
              >
                <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
                  <Flex flexDir="row" gap={4} alignItems="center">
                    {isLoading ? (
                      <Skeleton h={12} w={12} rounded="full" />
                    ) : (
                      <Avatar size="md" source={{ uri: friend.image }}>
                        SS
                        {friend.username === "Bill Gates" && <Avatar.Badge bg="green.500" />}
                      </Avatar>
                    )}

                    <Box>
                      {isLoading ? (
                        <Skeleton h={3} w={20} rounded="full" />
                      ) : (
                        <Text fontSize={16}>{friend.username}</Text>
                      )}
                      <Flex flexDir="row" alignItems="center" gap={1}>
                        {isLoading ? (
                          <Skeleton h={3} w={"48"} rounded="full" mt={1} />
                        ) : (
                          <Text opacity={0.5}>
                            {friend.chat.length > 35 ? friend.chat.slice(0, 35) + "..." : friend.chat}
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
  );
};

export default ChatListScreen;
