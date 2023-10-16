import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import {
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { Actionsheet, Avatar, Badge, Box, Button, Flex, Icon, Image, Pressable, Text, VStack, View } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { card } from "../../../styles/Card";
import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import FeedCardItem from "../../../components/Tribe/Feed/FeedCardItem";
import { CopyToClipboard } from "../../../components/shared/CopyToClipboard";
import { useDisclosure } from "../../../hooks/useDisclosure";

const EmployeeProfileScreen = ({ route }) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const { isOpen: teammatesIsOpen, toggle: toggleTeammates } = useDisclosure(false);
  const { isOpen: newFeedIsOpen, close: closeNewFeed, toggle: toggleNewFeed } = useDisclosure(false);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const { employeeId, returnPage, loggedEmployeeImage } = route.params;

  const router = useRoute();

  const tabs = [{ title: "posts" }];

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      setIsHeaderSticky(true);
    } else {
      setIsHeaderSticky(false);
    }
  };

  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: employee,
    isFetching: employeeIsFetching,
    refetch: refetchEmployee,
  } = useFetch(`/hr/employees/${router.params.employeeId}`);

  const {
    data: teammates,
    refetch: refetchTeammates,
    isFetching: teammatesIsFetching,
  } = useFetch(`/hr/employees/${router.params.employeeId}/team`);

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedsIsFetching,
  } = useFetch(!fetchIsDone && `/hr/posts/personal/${employee?.data?.id}`, [currentOffset], postFetchParameters);

  const handleCallPress = () => {
    try {
      const phoneUrl = `tel:0${employee?.data?.phone_number}`;
      Linking.openURL(phoneUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailPress = () => {
    try {
      const emailUrl = `mailto:${employee?.data?.email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleWhatsappPress = () => {
    try {
      const whatsappUrl = `whatsapp://send?phone=+62${employee?.data?.phone_number}`;
      Linking.openURL(whatsappUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const postEndReachedHandler = () => {
    if (!fetchIsDone) {
      if (posts.length !== posts.length + feeds?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

  useEffect(() => {
    if (feeds?.data) {
      if (currentOffset === 0) {
        setPosts(feeds?.data);
      } else {
        setPosts((prevData) => [...prevData, ...feeds?.data]);
      }
    }
  }, [feeds?.data]);

  // useEffect(() => {
  //   console.log(posts);
  // }, [posts]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex style={isHeaderSticky ? styles.stickyHeader : styles.header}>
        <PageHeader
          title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
          onPress={() => navigation.navigate(returnPage)}
        />
      </Flex>
      <Pressable
        style={styles.createIcon}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={() => {
          navigation.navigate("New Feed", {
            toggleNewFeed: toggleNewFeed,
            refetch: postRefetchHandler,
            loggedEmployeeImage: loggedEmployeeImage,
            loggedEmployeeName: userSelector?.name,
          });
        }}
      >
        <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
      </Pressable>
      <ScrollView onScroll={handleScroll}>
        <Image
          source={require("../../../assets/profile_banner.jpg")}
          alignSelf="center"
          h={200}
          w={500}
          alt="empty"
          resizeMode="cover"
        />
        <Flex flex={1} gap={5}>
          <Flex px={3} position="relative" flexDir="column" bgColor="#FFFFFF">
            {userSelector?.id !== employee?.data?.user_id ? (
              <>
                <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
                  <Pressable
                    padding={1}
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#dae2e6"
                    onPress={handleWhatsappPress}
                  >
                    <Icon as={<MaterialCommunityIcons name="whatsapp" />} size={6} />
                  </Pressable>
                  <Pressable
                    padding={1}
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#dae2e6"
                    onPress={handleEmailPress}
                  >
                    <Icon as={<MaterialCommunityIcons name="email-outline" />} size={6} />
                  </Pressable>

                  <Pressable
                    padding={1}
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#dae2e6"
                    onPress={() => navigation.navigate("Chat List")}
                  >
                    <Image
                      source={require("../../../assets/icons/nest_logo.png")}
                      alt="nest"
                      style={{ height: 25, width: 25 }}
                    />
                  </Pressable>
                </Flex>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${employee?.data?.image}` }}
                  resizeMethod="contain"
                  borderRadius="full"
                  w={100}
                  h={100}
                  alt="profile image"
                  borderWidth={2}
                  borderColor="#FFFFFF"
                  position="relative"
                  bottom="90px"
                />
                <Flex mt="-80px">
                  <Flex pb={3} px={1} gap={3}>
                    <Box>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Text fontWeight={500} fontSize={20} color="#3F434A">
                          {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
                        </Text>
                        <Text fontWeight={400} fontSize={14} color="#8A9099">
                          {`(${employee?.data?.gender.charAt(0).toUpperCase() + employee?.data?.gender.slice(1)})`}
                        </Text>
                      </Flex>

                      <Text fontWeight={400} fontSize={14} color="#8A9099">
                        {employee?.data?.position_name}
                      </Text>
                    </Box>
                    <Box>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={3} color="#3F434A" />
                        <TouchableOpacity onPress={() => CopyToClipboard(employee?.data?.phone_number)}>
                          <Text fontWeight={400} fontSize={12} color="#8A9099">
                            {employee?.data?.phone_number}
                          </Text>
                        </TouchableOpacity>
                      </Flex>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Icon as={<MaterialCommunityIcons name="cake-variant-outline" />} size={3} color="#3F434A" />
                        <Text fontWeight={400} fontSize={12} color="#8A9099">
                          {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
                        </Text>
                      </Flex>
                    </Box>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Text>{teammates?.data.length}</Text>
                      <Text onPress={toggleTeammates} fontWeight={400} fontSize={12} color="#8A9099">
                        Teammates
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            ) : (
              <>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${employee?.data?.image}` }}
                  resizeMethod="contain"
                  borderRadius="full"
                  w={100}
                  h={100}
                  alt="profile image"
                  borderWidth={2}
                  borderColor="#FFFFFF"
                  position="relative"
                  bottom="50px"
                />
                <Flex mt="-40px">
                  <Flex gap={3} pb={3}>
                    <Box>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Text fontWeight={500} fontSize={20} color="#3F434A">
                          {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
                        </Text>
                        <Text fontWeight={400} fontSize={14} color="#8A9099">
                          {`(${employee?.data?.gender.charAt(0).toUpperCase() + employee?.data?.gender.slice(1)})`}
                        </Text>
                      </Flex>

                      <Text fontWeight={400} fontSize={14} color="#8A9099">
                        {employee?.data?.position_name}
                      </Text>
                    </Box>
                    <Box>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={3} color="#3F434A" />
                        <TouchableOpacity onPress={() => CopyToClipboard(employee?.data?.phone_number)}>
                          <Text fontWeight={400} fontSize={12} color="#8A9099">
                            {employee?.data?.phone_number}
                          </Text>
                        </TouchableOpacity>
                      </Flex>
                      <Flex gap={1} alignItems="center" flexDir="row">
                        <Icon as={<MaterialCommunityIcons name="cake-variant-outline" />} size={3} color="#3F434A" />
                        <Text fontWeight={400} fontSize={12} color="#8A9099">
                          {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
                        </Text>
                      </Flex>
                    </Box>
                    <Flex gap={1} alignItems="center" flexDir="row">
                      <Text>{teammates?.data.length}</Text>
                      <Text onPress={toggleTeammates} fontWeight={400} fontSize={12} color="#8A9099">
                        Teammates
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            )}

            <Actionsheet isOpen={teammatesIsOpen} onClose={toggleTeammates}>
              <Actionsheet.Content>
                <VStack w="95%">
                  {teammates?.data.map((item) => {
                    return (
                      <Actionsheet.Item px={-1}>
                        <Flex flexDir="row" alignItems="center" gap={3}>
                          <AvatarPlaceholder image={item?.image} name={item?.name} size="md" borderRadius="full" />
                          <Flex>
                            <Text fontWeight={500} fontSize={14} color="#3F434A">
                              {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                            </Text>
                            <Text fontWeight={400} fontSize={12} color="#20A144">
                              {item?.position_name}
                            </Text>
                          </Flex>
                        </Flex>
                      </Actionsheet.Item>
                    );
                  })}
                </VStack>
              </Actionsheet.Content>
            </Actionsheet>
          </Flex>
          <Flex px={3} minHeight={2} flex={1} flexDir="column" gap={2}>
            <FlashList
              data={posts}
              keyExtractor={(item, index) => index}
              onEndReached={posts.length ? postEndReachedHandler : null}
              onEndReachedThreshold={0.1}
              refreshControl={<RefreshControl refreshing={feedsIsFetching} onRefresh={refetchFeeds} />}
              estimatedItemSize={100}
              renderItem={({ item }) => (
                <FeedCardItem
                  key={item?.id}
                  id={item?.id}
                  employeeId={item?.author_id}
                  employeeName={item?.employee_name}
                  createdAt={item?.created_at}
                  employeeImage={item?.employee_image}
                  content={item?.content}
                  total_like={item?.total_like}
                  totalComment={item?.total_comment}
                  likedBy={item?.liked_by}
                  attachment={item?.file_path}
                  type={item?.type}
                />
              )}
            />
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  stickyHeader: {
    backgroundColor: "white", // Ganti dengan warna latar yang sesuai
    borderBottomColor: "#E8E9EB", // Ganti dengan warna garis bawah yang sesuai
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  createIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
