import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFormik } from "formik";

import { SafeAreaView, StyleSheet, Text, View, Pressable, Linking, Clipboard, ScrollView } from "react-native";
import Toast from "react-native-root-toast";
import { replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps } from "../../../components/shared/CustomStylings";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";
import PageHeader from "../../../components/shared/PageHeader";
import FeedCommentPost from "../../../components/Tribe/Feed/FeedComment/FeedCommentPost";
import FeedCommentFormPost from "../../../components/Tribe/Feed/FeedComment/FeedCommentFormPost";
import FeedCardItemPost from "../../../components/Tribe/Feed/FeedCard/FeedCardItemPost";
import ShareImage from "../../../components/Tribe/Feed/ShareImage";

const PostScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [postId, setPostId] = useState(null);
  const [commentParentId, setCommentParentId] = useState(null);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reloadPost, setReloadPost] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [forceRerender, setForceRerender] = useState(false);
  const [currentOffsetPost, setCurrentOffsetPost] = useState(0);
  const [currentOffsetComments, setCurrentOffsetComments] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const route = useRoute();

  const navigation = useNavigation();

  const commentScreenSheetRef = useRef(null);

  const sharePostScreenSheetRef = useRef(null);

  const userSelector = useSelector((state) => state.auth);

  const { id } = route.params;

  const commentsFetchParameters = {
    offset: currentOffsetComments,
    limit: 10,
  };

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
    isLoading: postIsLoading,
  } = useFetch("/hr/posts");

  const { data: postData, refetch: refetchPostData, isFetching: postDataIsFetching } = useFetch(`/hr/posts/${id}`);

  const {
    data: comment,
    isFetching: commentIsFetching,
    isLoading: commentIsLoading,
    refetch: refetchComment,
  } = useFetch(
    `/hr/posts/${postData?.data?.id}/comment`,
    [reloadComment, currentOffsetComments],
    commentsFetchParameters
  );

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
   * Handle show username suggestion option
   */
  const employeeData = employees?.data.map(({ id, username }) => ({
    id,
    name: username,
  }));

  /**
   * Handle toggle fullscreen image
   */
  const toggleFullScreenHandler = useCallback((post) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPicture(post);
  }, []);

  /**
   * Handle add comment
   */
  const commentAddHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postData?.data?.id);
    posts[referenceIndex]["total_comment"] += 1;
    refetchPostData();
  };

  /**
   * Handle like a post
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetchPost();
      console.log("Process success");
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle submit a comment
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const commentSubmitHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/comment`, data);
      refetchPostData();
      commentRefetchHandler();
      commentAddHandler(postData?.data?.id);
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
   * Handle toggle reply a comment
   * @param {*} comment_parent_id
   */
  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  };

  /**
   * Handle press link
   */
  const linkPressHandler = useCallback((url) => {
    Linking.openURL(url);
  }, []);

  /**
   * Handle press email
   */
  const emailPressHandler = useCallback((email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

  /**
   * Handle copy to clipboard
   * @param {*} text
   */
  const copyToClipboard = (text) => {
    try {
      if (typeof text !== String) {
        var textToCopy = text.toString();
        Clipboard.setString(textToCopy);
      } else {
        Clipboard.setString(text);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sharePostToWhatsappHandler = async (message, url) => {
    let messageBody = `${message}\n${url}`;

    let whatsappUrl = `whatsapp://send?text=${encodeURIComponent(messageBody)}`;

    try {
      await Linking.openURL(whatsappUrl);
    } catch (err) {
      console.log(err);
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
   * Handle fetch more Comments
   * After end of scroll reached, it will added other earlier comments
   */
  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + comment?.data.length) {
      setCurrentOffsetComments(currentOffsetComments + 10);
    }
  };

  /**
   * Handle show suggestion username
   * @param {*} param0
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
              <Text style={[{}, TextProps]}>{item.name}</Text>
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
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue?.split(" ").pop();
    setSuggestions(employees?.data.filter((employee) => employee?.name.toLowerCase().includes(lastWord.toLowerCase())));
  };

  /**
   * Handle create a new comment
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      post_id: postData?.data?.id || "",
      comments: "",
      parent_id: commentParentId || "",
    },
    // validationSchema: yup.object().shape({
    //   comments: yup.string().required("Comments is required"),
    // }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
      const modifiedContent = values.comments.replace(mentionRegex, "@$1");
      values.comments = modifiedContent;
      commentSubmitHandler(values, setSubmitting, setStatus);
    },
  });

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
    if (comment?.data && commentIsFetching === false) {
      if (currentOffsetComments === 0) {
        setComments(comment?.data);
      } else {
        setComments((prevData) => [...prevData, ...comment?.data]);
      }
    }
  }, [commentIsFetching, reloadComment, commentParentId]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  });

  return (
    <>
      {isReady ? (
        <>
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <PageHeader
                title="Post"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
            <ScrollView
              style={{ backgroundColor: "#F8F8F8" }}
              refreshControl={
                <RefreshControl
                  refreshing={postDataIsFetching && commentIsFetching}
                  onRefresh={() => {
                    refetchPostData();
                    refetchComment();
                  }}
                />
              }
            >
              <View style={{ paddingHorizontal: 14 }}>
                <FeedCardItemPost
                  id={postData?.data?.id}
                  employeeId={postData?.data?.author_id}
                  employeeName={postData?.data?.employee_name}
                  createdAt={postData?.data?.updated_at}
                  employeeImage={postData?.data?.employee_image}
                  content={postData?.data?.content}
                  total_like={postData?.data?.total_like}
                  totalComment={postData?.data?.total_comment}
                  likedBy={postData?.data?.liked_by}
                  attachment={postData?.data?.file_path}
                  type={postData?.data?.type}
                  loggedEmployeeId={profile?.data?.id}
                  loggedEmployeeImage={profile?.data?.image}
                  onToggleLike={postLikeToggleHandler}
                  forceRerender={forceRerender}
                  setForceRerender={setForceRerender}
                  toggleFullScreen={toggleFullScreenHandler}
                  handleLinkPress={linkPressHandler}
                  handleEmailPress={emailPressHandler}
                  copyToClipboard={copyToClipboard}
                  employeeUsername={objectContainEmployeeUsernameHandler}
                  navigation={navigation}
                  reference={sharePostScreenSheetRef}
                />
                <FeedCommentPost
                  postId={postId}
                  loggedEmployeeName={userSelector?.name}
                  loggedEmployeeImage={profile?.data?.image}
                  comments={comments}
                  commentIsLoading={commentIsLoading}
                  onEndReached={commentEndReachedHandler}
                  parentId={commentParentId}
                  onSubmit={commentSubmitHandler}
                  onReply={replyHandler}
                  employeeUsername={objectContainEmployeeUsernameHandler}
                  employees={employees?.data}
                  reference={commentScreenSheetRef}
                  linkPressHandler={linkPressHandler}
                  emailPressHandler={emailPressHandler}
                  copyToClipboardHandler={copyToClipboard}
                />
              </View>
            </ScrollView>
            <FeedCommentFormPost
              loggedEmployeeImage={profile?.data?.image}
              loggedEmployeeName={userSelector?.name}
              parentId={commentParentId}
              renderSuggestions={renderSuggestionsHandler}
              handleChange={commentContainUsernameHandler}
              formik={formik}
            />
          </SafeAreaView>
        </>
      ) : (
        <></>
      )}
      <ShareImage
        reference={sharePostScreenSheetRef}
        navigation={navigation}
        type="Feed"
        sharePost={sharePostToWhatsappHandler}
      />

      <ImageFullScreenModal isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} file_path={selectedPicture} />
    </>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  image: {
    // flex: 1,
    width: 500,
    height: 350,
    backgroundColor: "white",
    resizeMode: "cover",
  },
});
