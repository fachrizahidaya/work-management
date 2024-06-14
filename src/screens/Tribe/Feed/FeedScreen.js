import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";

import { SafeAreaView, StyleSheet, Text, View, Pressable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import { TextProps } from "../../../components/shared/CustomStylings";
import FeedCard from "../../../components/Tribe/Feed/FeedCard/FeedCard";
import FeedComment from "../../../components/Tribe/Feed/FeedComment/FeedComment";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import {
  closeCommentHandler,
  likePostHandler,
  openCommentHandler,
  pressLinkHandler,
  refetchCommentHandler,
  replyCommentHandler,
  submitCommentHandler,
  toggleFullScreenImageHandler,
} from "../../../components/Tribe/Feed/shared/functions";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentOffsetPost, setCurrentOffsetPost] = useState(0);
  const [currentOffsetComments, setCurrentOffsetComments] = useState(0);
  const [reloadPost, setReloadPost] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [postId, setPostId] = useState(null);
  const [commentParentId, setCommentParentId] = useState(null);
  const [forceRerender, setForceRerender] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [hideCreateIcon, setHideCreateIcon] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);

  const navigation = useNavigation();
  const commentScreenSheetRef = useRef(null);
  const flashListRef = useRef(null);
  const scrollOffsetY = useRef(0);
  const SCROLL_THRESHOLD = 20;

  const userSelector = useSelector((state) => state.auth);

  const { isOpen: postSuccessIsOpen, toggle: togglePostSuccess } = useDisclosure(false);
  const { isOpen: postActionModalIsOpen, toggle: togglePostActionModal } = useDisclosure(false);
  const { isOpen: reportPostSuccessIsOpen, toggle: toggleReportPostSuccess } = useDisclosure(false);

  const postFetchParameters = {
    offset: currentOffsetPost,
    limit: 10,
  };

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
    isLoading: postIsLoading,
  } = useFetch("/hr/posts", [reloadPost, currentOffsetPost], postFetchParameters);

  const { data: profile } = useFetch("/hr/my-profile");
  const { data: employees } = useFetch("/hr/employees");

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

  const openSelectedPostHandler = useCallback((post) => {
    setSelectedPost(post);
    togglePostActionModal();
  }, []);

  const closeSelectedPostHandler = () => {
    setSelectedPost(null);
    togglePostActionModal();
  };

  const modalAfterNewPostHandler = () => {
    postRefetchHandler();
    togglePostSuccess();
    setRequestType("post");
  };

  const refreshPostsHandler = () => {
    setPosts([]);
    postRefetchHandler();
    refetchPost();
  };

  const refreshCommentsHandler = () => {
    refetchCommentHandler(setCurrentOffsetComments, setReloadComment, reloadComment);
    refetchComment();
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

  const params = {
    loggedEmployeeId: profile?.data?.id,
    loggedEmployeeImage: profile?.data?.image,
    loggedEmployeeName: userSelector?.name,
    loggedEmployeeDivision: profile?.data?.position_id,
    handleAfterNewPost: modalAfterNewPostHandler,
  };

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
   * Handle show username suggestion option
   */
  const employeeData = employees?.data?.map(({ id, username }) => ({
    id,
    name: username,
  }));

  /**
   * Handle show suggestion username
   * @param {*} param
   * @returns
   */
  const renderSuggestionsHandler = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <ScrollView style={{ maxHeight: 100 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "400" }}>{item.name}</Text>
            </Pressable>
          )}
        />
      </ScrollView>
    );
  };

  /**
   * Handle adjust the content if there is username
   * @param {*} value
   */
  const commentContainUsernameHandler = (value) => {
    formik.handleChange("comments")(value);
  };

  const scrollHandler = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const offsetDifference = currentOffsetY - scrollOffsetY.current;

    if (Math.abs(offsetDifference) < SCROLL_THRESHOLD) {
      return; // Ignore minor scrolls
    }

    if (currentOffsetY > scrollOffsetY.current) {
      if (scrollDirection !== "down") {
        setHideCreateIcon(true); // Scrolling down
        setScrollDirection("down");
      }
    } else {
      if (scrollDirection !== "up") {
        setHideCreateIcon(false); // Scrolling up
        setScrollDirection("up");
      }
    }

    scrollOffsetY.current = currentOffsetY;
  };

  /**
   * Handle create a new comment
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      post_id: postId || "",
      comments: "",
      parent_id: commentParentId || "",
    },
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
      const modifiedContent = values.comments.replace(mentionRegex, "@$1");
      values.comments = modifiedContent;
      submitCommentHandler(
        values,
        setSubmitting,
        setStatus,
        setCommentParentId,
        setCurrentOffsetComments,
        setReloadComment,
        reloadComment,
        posts,
        postId,
        setForceRerender,
        forceRerender
      );
    },
  });

  /**
   * After created a post, it will scroll to top
   */
  useEffect(() => {
    if (flashListRef.current && posts.length > 0) {
      flashListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  }, [posts]);

  /**
   * Handle infinite scroll
   */
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
    if (!openCommentHandler) {
      setCommentParentId(null);
      setComments([]); // after close current post's comment, it clear the comments
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#377893" }}>News</Text>
          <Text style={[{ fontSize: 16 }, TextProps]}> & Feed</Text>
        </View>
        <Text style={[{ fontWeight: "700" }, TextProps]}>{userSelector?.company}</Text>
      </View>

      {hideCreateIcon ? null : (
        <TouchableOpacity style={styles.createPostIcon} onPress={() => navigation.navigate("New Feed", params)}>
          <MaterialCommunityIcons name="pencil" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <FeedCard
        posts={posts}
        loggedEmployeeId={profile?.data?.id}
        loggedEmployeeImage={profile?.data?.image}
        handleWhenScrollReachedEnd={postEndReachedHandler}
        postIsFetching={postIsFetching}
        postIsLoading={postIsLoading}
        hasBeenScrolled={hasBeenScrolled}
        setHasBeenScrolled={setHasBeenScrolled}
        onCommentToggle={openCommentHandler}
        forceRerender={forceRerender}
        onToggleFullScreen={toggleFullScreenImageHandler}
        employeeUsername={objectContainEmployeeUsernameHandler}
        navigation={navigation}
        onPressLink={pressLinkHandler}
        onToggleLike={likePostHandler}
        reference={commentScreenSheetRef}
        setPostId={setPostId}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        setSelectedPicture={setSelectedPicture}
        onToggleReport={openSelectedPostHandler}
        handleRefreshPosts={refreshPostsHandler}
        handleIconWhenScrolling={scrollHandler}
      />

      <FeedComment
        loggedEmployeeName={userSelector?.name}
        loggedEmployeeImage={profile?.data?.image}
        comments={comments}
        commentIsFetching={commentIsFetching}
        commentIsLoading={commentIsLoading}
        handleClose={closeCommentHandler}
        handleWhenScrollReachedEnd={commentEndReachedHandler}
        parentId={commentParentId}
        onReply={replyCommentHandler}
        employeeUsername={objectContainEmployeeUsernameHandler}
        reference={commentScreenSheetRef}
        onPressLink={pressLinkHandler}
        handleUsernameSuggestions={renderSuggestionsHandler}
        handleShowUsername={commentContainUsernameHandler}
        formik={formik}
        setCommentParentId={setCommentParentId}
        setPostId={setPostId}
        setComments={setComments}
        navigation={navigation}
        handleRefreshComments={refreshCommentsHandler}
      />

      <ImageFullScreenModal
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        file_path={selectedPicture}
        setSelectedPicture={setSelectedPicture}
        type="Feed"
      />
      <SuccessModal
        isOpen={postSuccessIsOpen}
        toggle={togglePostSuccess}
        type={requestType}
        color="#7EB4FF"
        title="Post shared!"
        description="Thank you for contributing to the community"
      />
      <SuccessModal
        isOpen={reportPostSuccessIsOpen}
        toggle={toggleReportPostSuccess}
        type={requestType}
        title="Report Submitted!"
        description="Your report is logged"
      />
      <ConfirmationModal
        isOpen={postActionModalIsOpen}
        toggle={closeSelectedPostHandler}
        description="Are you sure want to report this post?"
        apiUrl={`/hr/post-report`}
        body={{
          post_id: selectedPost,
          notes: "Inappropriate Post",
        }}
        isDelete={false}
        showSuccessToast={false}
        hasSuccessFunc={true}
        onSuccess={() => {
          setRequestType("info");
          refetchPost();
        }}
        toggleOtherModal={toggleReportPostSuccess}
      />
    </SafeAreaView>
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
