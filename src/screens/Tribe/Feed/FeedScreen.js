FeedScreen;
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps } from "../../../components/shared/CustomStylings";
import FeedCard from "../../../components/Tribe/Feed/FeedCard/FeedCard";
import FeedComment from "../../../components/Tribe/Feed/FeedComment/FeedComment";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";

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
  const [imageToShare, setImageToShare] = useState(null);

  const navigation = useNavigation();

  const commentScreenSheetRef = useRef(null);

  const flashListRef = useRef(null);

  const userSelector = useSelector((state) => state.auth);

  const { isOpen: postSuccessIsOpen, toggle: togglePostSuccess } = useDisclosure(false);

  const postFetchParameters = {
    offset: currentOffsetPost,
    limit: 10,
  };

  const commentsFetchParameters = {
    offset: currentOffsetComments,
    limit: 10,
  };

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
    isLoading: postIsLoading,
  } = useFetch("/hr/posts", [reloadPost, currentOffsetPost], postFetchParameters);

  const {
    data: comment,
    isFetching: commentIsFetching,
    isLoading: commentIsLoading,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [reloadComment, currentOffsetComments], commentsFetchParameters);

  const { data: profile } = useFetch("/hr/my-profile");

  const { data: employees } = useFetch("/hr/employees");

  /**
   * Handle show username in post
   */
  const objectContainEmployeeUsernameHandler = employees?.data?.map((item) => {
    return {
      username: item.username,
      id: item.id,
      name: item.name,
    };
  });

  /**
   * Handle toggle fullscreen image
   */
  const toggleFullScreenHandler = useCallback((image) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPicture(image);
  }, []);

  /**
   * Handle Fetch more Posts
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (posts.length !== posts.length + post?.data.length) {
      setCurrentOffsetPost(currentOffsetPost + 10);
    }
  };

  /**
   * Handle fetch post from first offset
   * After create a new post or comment, it will return to the first offset
   */
  const postRefetchHandler = () => {
    setCurrentOffsetPost(0);
    setReloadPost(!reloadPost);
  };

  /**
   * Handle fetch more Comments
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + comment?.data.length) {
      setCurrentOffsetComments(currentOffsetComments + 10);
    }
  };

  /**
   * Handle fetch comment from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffsetComments(0);
    setReloadComment(!reloadComment);
  };

  /**
   * Handle open comment Action sheet
   */
  const commentsOpenHandler = (post_id) => {
    commentScreenSheetRef.current?.show();
    setPostId(post_id);
    const togglePostComment = posts.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  /**
   * Handle close comment Action sheet
   */
  const commentsCloseHandler = () => {
    commentScreenSheetRef.current?.hide();
    setPostId(null);
    setCommentParentId(null);
    setLatestExpandedReply(null);
  };

  /**
   * Handle add comment
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
   * Handle Submit a comment
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const commentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post(`/hr/posts/comment`, data);
      commentRefetchHandler();
      commentAddHandler(postId);
      setCommentParentId(null);
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * Handle toggle reply comment
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
            <Text style={[{ fontSize: 16 }, TextProps]}> & Feed</Text>
          </View>
          <Text style={[{ fontWeight: "700" }, TextProps]}>{userSelector?.company}</Text>
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
              toggleSuccess: togglePostSuccess,
            });
          }}
        >
          <MaterialCommunityIcons name="pencil" size={30} color="#FFFFFF" />
        </Pressable>

        <View
          style={{
            display: "flex",
            flex: 1,
          }}
        >
          {/* Content here */}

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
            onCommentToggle={commentsOpenHandler}
            forceRerender={forceRerender}
            setForceRerender={setForceRerender}
            toggleFullScreen={toggleFullScreenHandler}
            employeeUsername={objectContainEmployeeUsernameHandler}
            navigation={navigation}
          />
        </View>
        <FeedComment
          postId={postId}
          loggedEmployeeName={userSelector?.name}
          loggedEmployeeImage={profile?.data?.image}
          comments={comments}
          commentIsFetching={commentIsFetching}
          commentIsLoading={commentIsLoading}
          refetchComment={refetchComment}
          handleClose={commentsCloseHandler}
          onEndReached={commentEndReachedHandler}
          commentRefetchHandler={commentRefetchHandler}
          parentId={commentParentId}
          onSubmit={commentSubmitHandler}
          onReply={replyHandler}
          employeeUsername={objectContainEmployeeUsernameHandler}
          employees={employees?.data}
          reference={commentScreenSheetRef}
        />
      </SafeAreaView>
      <ImageFullScreenModal
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        file_path={selectedPicture}
        navigation={navigation}
        postRefetchHandler={postRefetchHandler}
        loggedEmployeeId={profile?.data?.id}
        loggedEmployeeImage={profile?.data?.image}
        loggedEmployeeName={userSelector?.name}
        loggedEmployeeDivision={profile?.data?.position_id}
        toggleSuccess={togglePostSuccess}
        setSelectedPicture={setSelectedPicture}
      />
      <SuccessModal
        isOpen={postSuccessIsOpen}
        toggle={togglePostSuccess}
        topElement={
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#7EB4FF", fontSize: 16, fontWeight: "500" }}>Post </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>shared!</Text>
          </View>
        }
        bottomElement={
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>
            Thank you for contributing to the community
          </Text>
        }
      />
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
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
