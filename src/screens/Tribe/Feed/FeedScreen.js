import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { Box, Flex, Icon, Pressable, ScrollView, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FeedCard from "../../../components/Tribe/Feed/FeedCard";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { LikeToggle } from "../../../components/shared/LikeToggle";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);

  // parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  // User redux to fetch employeeName
  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedsIsFetching,
    isLoading: feedsIsLoading,
  } = useFetch(!fetchIsDone && "/hr/posts", [currentOffset], postFetchParameters);

  const {
    data: profile,
    isLoading: profileIsLoading,
    refetch: refetchProfile,
    isFetching: profileIsFetching,
  } = useFetch("/hr/my-profile");

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */

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

  /**
   * Like post handler
   * @param {*} post_id
   * @param {*} action
   */

  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      setTimeout(() => {
        console.log("liked this post!");
      }, 500);
    } catch (err) {
      console.log(err);
    }
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="#FFFFFF" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text color="primary.600" fontWeight={700} fontSize={16}>
              News
            </Text>
            <Text fontSize={16}>& Feed</Text>
          </Flex>
          <Text fontWeight={700} fontSize={12}>
            PT Kolabora Group Indonesia
          </Text>
        </Flex>

        <Pressable
          style={styles.createIcon}
          shadow="0"
          borderRadius="full"
          borderWidth={3}
          borderColor="#FFFFFF"
          onPress={() => {
            navigation.navigate("New Feed", {
              refetch: postRefetchHandler,
              loggedEmployeeId: profile?.data?.id,
              loggedEmployeeImage: profile?.data?.image,
              loggedEmployeeName: userSelector?.name,
              loggedEmployeeDivision: profile?.data?.position_id,
            });
          }}
        >
          <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
        </Pressable>

        <Box flex={1} px={3}>
          {/* Content here */}
          <FeedCard
            posts={posts}
            loggedEmployeeId={profile?.data?.id}
            loggedEmployeeImage={profile?.data?.image}
            loggedEmployeeName={userSelector?.name}
            onToggleLike={postLikeToggleHandler}
            postRefetchHandler={postRefetchHandler}
            handleEndReached={postEndReachedHandler}
            feedsIsFetching={feedsIsFetching}
            refetchFeeds={refetchFeeds}
          />
        </Box>
      </SafeAreaView>
    </>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
});
