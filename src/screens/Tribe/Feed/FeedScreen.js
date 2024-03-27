import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";

import { SafeAreaView, StyleSheet, Text, View, Pressable, Linking } from "react-native";
import Toast from "react-native-root-toast";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

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
  const [postId, setPostId] = useState(null);
  const [commentParentId, setCommentParentId] = useState(null);
  const [forceRerender, setForceRerender] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [requestType, setRequestType] = useState("");

  const navigation = useNavigation();
  const commentScreenSheetRef = useRef(null);
  const flashListRef = useRef(null);

  const userSelector = useSelector((state) => state.auth);

  const { isOpen: postSuccessIsOpen, toggle: togglePostSuccess } = useDisclosure(false);

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
  };

  /**
   * Handle close comment Action sheet
   */
  const commentsCloseHandler = () => {
    commentScreenSheetRef.current?.hide();
    setPostId(null);
    setCommentParentId(null);
  };

  /**
   * Handle add comment
   */
  const commentAddHandler = () => {
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
   * Handle like a Post
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPost();
      console.log("Process success");
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle toggle reply comment
   */
  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
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
   * Handle toggle fullscreen image
   */
  const toggleFullScreenHandler = useCallback((image) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPicture(image);
  }, []);

  /**
   * Handle press link
   */
  const linkPressHandler = useCallback((url) => {
    const playStoreUrl = url?.includes("https://play.google.com/store/apps/details?id=");
    const appStoreUrl = url?.includes("https://apps.apple.com/id/app");
    let trimmedPlayStoreUrl;
    let trimmedAppStoreUrl;
    if (playStoreUrl) {
      trimmedPlayStoreUrl = url?.slice(37);
    } else if (appStoreUrl) {
      trimmedAppStoreUrl = url?.slice(7);
    }

    let modifiedAppStoreUrl = "itms-apps" + trimmedAppStoreUrl;
    let modifiedPlayStoreUrl = "market://" + trimmedPlayStoreUrl;

    try {
      if (playStoreUrl) {
        Linking.openURL(modifiedPlayStoreUrl);
      } else if (appStoreUrl) {
        Linking.openURL(modifiedAppStoreUrl);
      } else {
        Linking.openURL(url);
      }
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
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

  const params = {
    postRefetchHandler: postRefetchHandler,
    loggedEmployeeId: profile?.data?.id,
    loggedEmployeeImage: profile?.data?.image,
    loggedEmployeeName: userSelector?.name,
    loggedEmployeeDivision: profile?.data?.position_id,
    toggleSuccess: togglePostSuccess,
    setRequestType: setRequestType,
  };

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
      commentSubmitHandler(values, setSubmitting, setStatus);
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
            navigation.navigate("New Feed", params);
          }}
        >
          <MaterialCommunityIcons name="pencil" size={30} color="#FFFFFF" />
        </Pressable>

        <View
          style={{
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
            onPressLink={linkPressHandler}
            onToggleLike={postLikeToggleHandler}
          />
        </View>
        <FeedComment
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
          onReply={replyHandler}
          employeeUsername={objectContainEmployeeUsernameHandler}
          reference={commentScreenSheetRef}
          onPressLink={linkPressHandler}
          onSuggestions={renderSuggestionsHandler}
          commentContainUsernameHandler={commentContainUsernameHandler}
          formik={formik}
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
