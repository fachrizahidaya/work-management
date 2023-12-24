import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import Toast from "react-native-toast-message";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import FeedCard from "../../../components/Tribe/Feed/FeedCard";
import FeedComment from "../../../components/Tribe/Feed/FeedComment/FeedComment";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentOffsetPost, setCurrentOffsetPost] = useState(0);
  const [currentOffsetComments, setCurrentOffsetComments] = useState(0);
  const [reloadPost, setReloadPost] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [scrollNewMessage, setScrollNewMessage] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [postId, setPostId] = useState(null);
  const [commentParentId, setCommentParentId] = useState(null);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const commentScreenSheetRef = useRef(null);

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  const flashListRef = useRef(null);

  /**
   * Toggle fullscreen image
   */
  const toggleFullScreen = useCallback((post) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPicture(post);
  }, []);

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffsetPost,
    limit: 5,
  };

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
    isLoading: postIsLoading,
  } = useFetch("/hr/posts", [reloadPost, currentOffsetPost], postFetchParameters);

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffsetComments,
    limit: 10,
  };

  const {
    data: comment,
    isFetching: commentIsFetching,
    isLoading: commentIsLoading,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [reloadComment, currentOffsetComments], commentsFetchParameters);

  const { data: profile } = useFetch("/hr/my-profile");

  const { data: employees, isFetching: employeesIsFetching, refetch: refetchEmployees } = useFetch("/hr/employees");
  const employeeUsername = employees?.data?.map((item) => {
    return {
      username: item.username,
      id: item.id,
      name: item.name,
    };
  });

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (posts.length !== posts.length + post?.data.length) {
      setCurrentOffsetPost(currentOffsetPost + 5);
    }
  };

  /**
   * Fetch from first offset
   * After create a new post or comment, it will return to the first offset
   */
  const postRefetchHandler = () => {
    setCurrentOffsetPost(0);
    setReloadPost(!reloadPost);
  };

  /**
   * Fetch more Comments handler
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + comment?.data.length) {
      setCurrentOffsetComments(currentOffsetComments + 10);
    }
  };

  /**
   * Fetch from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffsetComments(0);
    setReloadComment(!reloadComment);
  };

  /**
   * Action sheet for comment handler
   */
  const commentsOpenHandler = (post_id) => {
    commentScreenSheetRef.current?.show();
    setPostId(post_id);
    // setCommentsOpen(true);
    const togglePostComment = posts.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  const commentsCloseHandler = () => {
    // setCommentsOpen(false);
    commentScreenSheetRef.current?.hide();
    setPostId(null);
  };

  /**
   * Submit comment handler
   */
  const commentAddHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
    setForceRerender(!forceRerender);
  };

  /**
   * Submit a comment handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const commentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/comment`, data);
      commentRefetchHandler();
      commentAddHandler(postId);
      setCommentParentId(null);
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * Control for reply a comment
   */
  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  };

  /**
   * After created a post, it will scroll to top
   */
  useEffect(() => {
    if (flashListRef.current && posts.length > 0) {
      flashListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  }, [posts]);

  useEffect(() => {
    if (post?.data && postIsFetching === false) {
      if (currentOffsetPost === 0) {
        setPosts(post?.data);
      } else {
        setPosts((prevData) => [...prevData, ...post?.data]);
      }
    }
  }, [postIsFetching, reloadPost]);

  useEffect(() => {
    if (!commentsOpenHandler) {
      setCommentParentId(null);
    } else {
      if (comment?.data && commentIsFetching === false) {
        if (currentOffsetComments === 0) {
          setComments(comment?.data);
        } else {
          setComments((prevData) => [...prevData, ...comment?.data]);
        }
      }
    }
  }, [commentIsFetching, reloadComment, commentParentId]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#377893" }}>News</Text>
            <Text style={{ fontSize: 16, fontWeight: "500" }}> & Feed</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: "700" }}>PT Kolabora Group Indonesia</Text>
        </View>

        <Pressable
          style={styles.createPostIcon}
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
          <MaterialCommunityIcons name="pencil" size={30} color="#FFFFFF" />
        </Pressable>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {/* Content here */}
          <>
            <FeedCard
              posts={posts}
              loggedEmployeeId={profile?.data?.id}
              loggedEmployeeImage={profile?.data?.image}
              postRefetchHandler={postRefetchHandler}
              postEndReachedHandler={postEndReachedHandler}
              postIsFetching={postIsFetching}
              postIsLoading={postIsLoading}
              refetchPost={refetchPost}
              hasBeenScrolled={hasBeenScrolled}
              setHasBeenScrolled={setHasBeenScrolled}
              scrollNewMessage={scrollNewMessage}
              flashListRef={flashListRef}
              onCommentToggle={commentsOpenHandler}
              forceRerender={forceRerender}
              setForceRerender={setForceRerender}
              toggleFullScreen={toggleFullScreen}
              employeeUsername={employeeUsername}
              navigation={navigation}
            />

            <FeedComment
              postId={postId}
              loggedEmployeeName={userSelector?.name}
              loggedEmployeeImage={profile?.data?.image}
              comments={comments}
              commentIsFetching={commentIsFetching}
              refetchComment={refetchComment}
              handleOpen={commentsOpenHandler}
              handleClose={commentsCloseHandler}
              onEndReached={commentEndReachedHandler}
              commentRefetchHandler={commentRefetchHandler}
              parentId={commentParentId}
              onSubmit={commentSubmitHandler}
              onReply={replyHandler}
              employeeUsername={employeeUsername}
              employees={employees?.data}
              reference={commentScreenSheetRef}
            />
          </>
        </View>
        <Toast />
      </SafeAreaView>
      <ImageFullScreenModal isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} file_path={selectedPicture} />
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
    borderRadius: 30,
    shadowOffset: 0,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});
