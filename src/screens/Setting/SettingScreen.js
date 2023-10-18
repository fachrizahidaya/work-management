import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";

import { Dimensions } from "react-native";
import { Avatar, Box, Button, Center, Flex, Icon, Pressable, ScrollView, Skeleton, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import axiosInstance from "../../config/api";
import { update_profile } from "../../redux/reducer/auth";

const SettingScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const userSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data: team, isLoading: teamIsLoading } = useFetch("/hr/my-team");
  const { data: myProfile } = useFetch("/hr/my-profile");

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

  const {
    data: profile,
    isFetching: profileIsFetching,
    refetch: refetchProfile,
    isLoading: profileIsLoading,
  } = useFetch("/hr/my-profile");

  const editProfileHandler = async (form, setSubmitting) => {
    try {
      const res = await axiosInstance.patch(`/setting/users/${userSelector.id}`, { ...form, password: "" });
      dispatch(update_profile(res.data.data));
      setSubmitting(false);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <Box bg="white" w={width} flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex bgColor="white" p={5} pb={10} gap={33}>
          <PageHeader backButton={false} title="Settings" />

          <Box bgColor="#FAFAFA" borderRadius={9}>
            <Pressable
              onPress={() =>
                navigation.navigate("Account Screen", { profile: profile, editProfileHandler: editProfileHandler })
              }
            >
              <Flex direction="row" justifyContent="space-between" alignItems="center" p="8px 12px">
                <Box>
                  <Flex direction="row" gap={4}>
                    <AvatarPlaceholder name={userSelector.name} image={userSelector.image} size="md" />
                    <Box>
                      <Text fontSize={20} fontWeight={700}>
                        {userSelector.name.length > 30 ? userSelector.name.split(" ")[0] : userSelector.name}
                      </Text>
                      {myProfile?.data && <Text>{myProfile.data.position_name || "You have no position"}</Text>}
                    </Box>
                  </Flex>
                </Box>

                <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" color="#3F434A" />
              </Flex>
            </Pressable>

            <Pressable
              display="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="space-between"
              h={42}
              p="8px 12px"
            >
              <Flex flexDir="row" alignItems="center" gap={4}>
                {team?.data?.length > 0 && (
                  <Center px={3}>
                    <Avatar.Group>
                      {!teamIsLoading ? (
                        team.data.length > 0 &&
                        team.data.map((item) => {
                          return (
                            <Avatar
                              key={item.id}
                              size="sm"
                              source={{
                                uri: `${process.env.EXPO_PUBLIC_API}/image/${item.image}`,
                              }}
                            />
                          );
                        })
                      ) : (
                        <Skeleton h={35} />
                      )}
                    </Avatar.Group>
                  </Center>
                )}

                <Flex flexDirection="row" gap={1}>
                  {myProfile?.data && <Text>{myProfile.data.division_name || "You have no team"}</Text>}
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
