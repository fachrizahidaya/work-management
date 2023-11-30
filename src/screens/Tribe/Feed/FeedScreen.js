import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Pressable, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FeedCard from "../../../components/Tribe/Feed/FeedCard";
import { useFetch } from "../../../hooks/useFetch";
import { useRef } from "react";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [reload, setReload] = useState(false);
  const [scrollNewMessage, setScrollNewMessage] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const toast = useToast();

  const flashListRef = useRef(null);

  useEffect(() => {
    if (flashListRef.current && posts.length > 0) {
      flashListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  }, [posts]);

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
  } = useFetch("/hr/posts", [reload, currentOffset], postFetchParameters);

  const { data: profile } = useFetch("/hr/my-profile");

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (posts.length !== posts.length + post?.data.length) {
      setCurrentOffset(currentOffset + 10);
    }
  };

  /**
   * Fetch from first offset
   * After create a new post or comment, it will return to the first offset
   */
  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setReload(!reload);
  };

  useEffect(() => {
    if (post?.data && postIsFetching === false) {
      if (currentOffset === 0) {
        setPosts(post?.data);
      } else {
        setPosts((prevData) => [...prevData, ...post?.data]);
      }
    }
  }, [postIsFetching, reload]);

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
          style={styles.createPostIcon}
          shadow="0"
          borderRadius="full"
          borderWidth={3}
          borderColor="#FFFFFF"
          onPress={() => {
            navigation.navigate("New Feed", {
              postRefetchHandler: postRefetchHandler, // To get new post after create one
              loggedEmployeeId: profile?.data?.id,
              loggedEmployeeImage: profile?.data?.image,
              loggedEmployeeName: userSelector?.name,
              loggedEmployeeDivision: profile?.data?.position_id,
              scrollNewMessage: scrollNewMessage,
              setScrollNewMessage: setScrollNewMessage,
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
            postRefetchHandler={postRefetchHandler}
            postEndReachedHandler={postEndReachedHandler}
            postIsFetching={postIsFetching}
            refetchPost={refetchPost}
            hasBeenScrolled={hasBeenScrolled}
            setHasBeenScrolled={setHasBeenScrolled}
            reload={reload}
            setReload={setReload}
            scrollNewMessage={scrollNewMessage}
            flashListRef={flashListRef}
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
  createPostIcon: {
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
