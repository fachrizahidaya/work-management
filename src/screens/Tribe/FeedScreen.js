import { SafeAreaView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Box, Flex, Icon, Pressable, ScrollView, Text } from "native-base";
import axiosInstance from "../../config/api";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FeedCard from "../../components/Tribe/Feed/FeedCard";
import NewFeedSlider from "../../components/Tribe/Feed/NewFeedSlider";

const FeedScreen = () => {
  const { data: profile, isLoading: profileIsLoading } = useFetch("/hr/my-profile");
  const { data: feeds, isLoading: feedIsLoading } = useFetch("/hr/posts");
  const [newFeedIsOpen, setNewFeedIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [postFetchDone, setPostFetchDone] = useState(false);

  const fetchMyProfile = async () => {
    try {
      setMyProfile(profile?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPost = async () => {
    try {
      setPosts(feeds?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);

  const postSubmitHandler = async (data) => {
    try {
      const res = await axiosInstance.post(`/hr/posts`, data);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
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
              setNewFeedIsOpen(!newFeedIsOpen);
            }}
          >
            <Icon as={<SimpleLineIcons name="pencil" />} size={30} color="white" />
          </Pressable>
        </Box>
        <ScrollView px={5} h="100%" showsVerticalScrollIndicator={false}>
          <Flex flex={1} flexDir="column" gap={5} my={5}>
            {/* Content here */}
            <FeedCard
              loggedEmployeeId={myProfile?.id}
              loggedEmployeeImage={myProfile?.image}
              feeds={feeds?.data}
              onToggleLike={postLikeToggleHandler}
              feedIsLoading={feedIsLoading}
              profileIsLoading={profileIsLoading}
            />
          </Flex>
        </ScrollView>
      </SafeAreaView>

      <NewFeedSlider isOpen={newFeedIsOpen} setIsOpen={setNewFeedIsOpen} onSubmit={postSubmitHandler} />
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
