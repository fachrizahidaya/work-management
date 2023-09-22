import { SafeAreaView, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Box, Flex, Icon, Pressable, ScrollView, Text } from "native-base";
import axiosInstance from "../../config/api";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FeedCard from "../../components/Tribe/Feed/FeedCard";
import NewFeedSlider from "../../components/Tribe/Feed/NewFeedSlider";
import { useDisclosure } from "../../hooks/useDisclosure";

const FeedScreen = () => {
  const { isOpen: newFeedIsOpen, close: closeNewFeed, toggle: toggleNewFeed } = useDisclosure(false);
  const [posts, setPosts] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const {
    data: feeds,
    refetch,
    isFetching,
  } = useFetch(!fetchIsDone && "/hr/posts", [currentOffset], postFetchParameters);

  const { data: profile, isLoading: profileIsLoading } = useFetch("/hr/my-profile");

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
    // reset posisi scroll ke paling atas
  };

  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      setTimeout(() => {
        console.log(posts);
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
        <Box
          bg="#377893"
          borderWidth={2}
          borderColor="white"
          borderRadius="full"
          padding="13px"
          width="60px"
          height="60px"
          position="absolute"
          bottom={10}
          right={10}
          zIndex={2}
        >
          <Pressable
            onPress={() => {
              toggleNewFeed();
            }}
          >
            <Icon as={<SimpleLineIcons name="pencil" />} size={30} color="white" />
          </Pressable>
        </Box>

        <Flex px={5} flex={1} flexDir="column" gap={5} my={5}>
          {/* Content here */}
          <FeedCard
            loggedEmployeeId={profile?.data?.id}
            loggedEmployeeImage={profile?.data?.image}
            loggedEmployeeName={profile?.data?.name}
            posts={posts}
            onToggleLike={postLikeToggleHandler}
            refetch={postRefetchHandler}
            handleEndReached={postEndReachedHandler}
          />
        </Flex>
      </SafeAreaView>

      {newFeedIsOpen && <NewFeedSlider toggle={toggleNewFeed} refetch={postRefetchHandler} />}
    </>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
});
