import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { Box, Flex, Icon, Pressable, ScrollView, Text } from "native-base";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FeedCard from "../../components/Tribe/Feed/FeedCard";
import NewFeedSlider from "../../components/Tribe/Feed/NewFeedSlider";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../config/api";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const { isOpen: newFeedIsOpen, close: closeNewFeed, toggle: toggleNewFeed } = useDisclosure(false);
  // User redux to fetch employeeName
  const userSelector = useSelector((state) => state.auth);
  // parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedIsFetching,
  } = useFetch(!fetchIsDone && "/hr/posts", [currentOffset], postFetchParameters);

  const {
    data: profile,
    isLoading: profileIsLoading,
    refetch: refetchProfile,
    isFetching: profileIsFetching,
  } = useFetch("/hr/my-profile");

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

  // useEffect(() => {
  //   console.log(posts);
  // }, [posts]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
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
          borderRadius="full"
          onPress={() => {
            toggleNewFeed();
          }}
        >
          <Icon as={<SimpleLineIcons name="pencil" />} size={30} color="white" />
        </Pressable>
        {/* <ScrollView> */}
        <Flex px={3} my={3} flex={1} flexDir="column">
          {/* Content here */}
          <FeedCard
            loggedEmployeeId={profile?.data?.id}
            loggedEmployeeImage={profile?.data?.image}
            loggedEmployeeName={userSelector?.name}
            posts={posts}
            onToggleLike={postLikeToggleHandler}
            postRefetchHandler={postRefetchHandler}
            handleEndReached={postEndReachedHandler}
            feedIsFetching={feedIsFetching}
            refetchFeeds={refetchFeeds}
          />
        </Flex>
        {/* </ScrollView> */}
      </SafeAreaView>

      {newFeedIsOpen && (
        <NewFeedSlider
          toggleNewFeed={toggleNewFeed}
          refetch={postRefetchHandler}
          loggedEmployeeImage={profile?.data?.image}
          loggedEmployeeName={userSelector?.name}
        />
      )}
    </>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    // position: "relative",
  },
  createIcon: {
    backgroundColor: "#377893",
    padding: 15,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
});
