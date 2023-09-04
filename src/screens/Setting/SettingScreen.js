import React from "react";
import { Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Avatar, Box, Button, Center, Flex, Icon, Pressable, ScrollView, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SettingScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const userSelector = useSelector((state) => state.auth);

  const first = [
    {
      icons: "lock-outline",
      title: "Passwords",
      color: "#FF965D",
    },
    {
      icons: "alert-octagon-outline",
      title: "Privacy and security",
      color: "#FF6262",
    },
    {
      icons: "bell-outline",
      title: "Notifications",
      color: "#5B5D6E",
    },
  ];

  const second = [
    {
      icons: "folder-move-outline",
      title: "Data usage and media quality",
      color: "#5E74EA",
    },
    {
      icons: "swap-vertical",
      title: "Server status",
      color: "#69E86E",
    },
    {
      icons: "cellphone",
      title: "iOS guide",
      color: "#000000",
    },
  ];

  return (
    <Box w={width} style={{ height: Platform.OS === "android" ? height - 178 : height - 220 }}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false} bounces={false}>
        <Flex bgColor="white" p={5} gap={33}>
          <Text fontSize={16} fontWeight={500}>
            Settings
          </Text>

          <Box bgColor="#FAFAFA" borderRadius={9}>
            <Flex direction="row" justifyContent="space-between" alignItems="center" p="8px 12px">
              <Box>
                <Flex direction="row" gap={4}>
                  <Avatar
                    source={{
                      uri: `https://dev.kolabora-app.com/api-dev/image/${userSelector.image}/thumb`,
                    }}
                  />
                  <Box>
                    <Text fontSize={18} fontWeight={700}>
                      {userSelector.name.length > 30 ? userSelector.name.split(" ")[0] : userSelector.name}
                    </Text>
                    <Text fontSize={12}>{userSelector.user_type}</Text>
                  </Box>
                </Flex>
              </Box>

              <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
            </Flex>

            <Pressable
              display="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="space-between"
              h={42}
              p="8px 12px"
            >
              <Flex flexDir="row" alignItems="center" gap={4}>
                <Center ml={3}>
                  <Avatar.Group>
                    <Avatar
                      size="sm"
                      source={{
                        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      }}
                    />
                    <Avatar
                      size="sm"
                      source={{
                        uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                      }}
                    />
                    <Avatar
                      size="sm"
                      source={{
                        uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      }}
                    />
                  </Avatar.Group>
                </Center>

                <Flex flexDirection="row" gap={1}>
                  <Text>Team</Text>
                </Flex>
              </Flex>

              <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
            </Pressable>
          </Box>

          <Flex bgColor="#FAFAFA" borderRadius={9}>
            {first.map((item) => {
              return (
                <Pressable
                  key={item.title}
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="space-between"
                  h={42}
                  p="8px 12px"
                >
                  <Flex flexDir="row" alignItems="center" gap={4}>
                    <Box bgColor={item.color} p={1} borderRadius={4}>
                      <Icon as={<MaterialCommunityIcons name={item.icons} />} size="md" color="white" />
                    </Box>
                    <Text>{item.title}</Text>
                  </Flex>

                  <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
                </Pressable>
              );
            })}
          </Flex>

          <Pressable
            display="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            bgColor="#FAFAFA"
            borderRadius={9}
            h={42}
            p="8px 12px"
          >
            <Flex flexDir="row" alignItems="center" gap={4}>
              <Box bgColor="#8B63E7" p={1} borderRadius={4}>
                <Icon as={<MaterialCommunityIcons name="link-variant" />} size="md" color="white" />
              </Box>
              <Flex flexDirection="row" gap={1}>
                <Text color="primary.600" bold>
                  KSS
                </Text>
                <Text>integrations</Text>
              </Flex>
            </Flex>

            <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
          </Pressable>

          <Pressable
            display="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            bgColor="#FAFAFA"
            borderRadius={9}
            h={42}
            p="8px 12px"
          >
            <Flex flexDir="row" alignItems="center" gap={4}>
              <Box bgColor="#B5B5B5" p={1} borderRadius={4}>
                <Icon as={<MaterialCommunityIcons name="view-grid-outline" />} size="md" color="white" />
              </Box>
              <Text>Personal dashboard</Text>
            </Flex>

            <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
          </Pressable>

          <Flex bgColor="#FAFAFA" borderRadius={9}>
            {second.map((item) => {
              return (
                <Pressable
                  key={item.title}
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="space-between"
                  h={42}
                  p="8px 12px"
                >
                  <Flex flexDir="row" alignItems="center" gap={4}>
                    <Box bgColor={item.color} p={1} borderRadius={4}>
                      <Icon as={<MaterialCommunityIcons name={item.icons} />} size="md" color="white" />
                    </Box>
                    <Text>{item.title}</Text>
                  </Flex>
                  {item.title === "Server status" ? (
                    <Text color="green.400" mr={2}>
                      Online
                    </Text>
                  ) : (
                    <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
                  )}
                </Pressable>
              );
            })}
          </Flex>

          <Button onPress={() => navigation.navigate("Log Out")} bgColor="#FAFAFA" borderRadius={9}>
            <Text color="#FF6262" bold>
              Log out
            </Text>
          </Button>
        </Flex>
      </ScrollView>
    </Box>
  );
};

export default SettingScreen;
