import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Pressable, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import FeedCard from "../../../components/Tribe/Feed/FeedCard";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../../components/shared/ToastDialog";

const FeedScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const toast = useToast();

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: feeds,
    refetch: refetchFeeds,
    isFetching: feedsIsFetching,
  } = useFetch(fetchIsDone === false && "/hr/posts", [currentOffset], postFetchParameters);

  console.log(feeds?.data);
  console.log(currentOffset);

  const { data: profile } = useFetch("/hr/my-profile");

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (fetchIsDone === false) {
      if (posts.length !== posts.length + feeds?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  /**
   * Fetch from first offset
   * After create a new post or comment, it will return to the first offset
   */
  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      setTimeout(() => {
        console.log("Process success");
      }, 500);
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Process error, please try again later"} close={() => toast.close(id)} />;
        },
        placement: "top",
      });
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
          style={styles.createPostIcon}
          shadow="0"
          borderRadius="full"
          borderWidth={3}
          borderColor="#FFFFFF"
          onPress={() => {
            navigation.navigate("New Feed", {
              refetch: refetchFeeds,
              postRefetchHandler: postRefetchHandler,
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
            feeds={feeds}
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
