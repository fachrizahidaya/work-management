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

  const userSelector = useSelector((state) => state.auth);

  const { id } = route.params;

  const { data: postData, refetch: refetchPostData, isFetching: postDataIsFetching } = useFetch(`/hr/posts/${id}`);

  const { data: profile } = useFetch("/hr/my-profile");

  const { data: employees } = useFetch("/hr/employees");
  const employeeUsername = employees?.data?.map((item) => {
    return {
      username: item.username,
      id: item.id,
      name: item.name,
    };
  });
  const employeeData = employees?.data.map(({ id, username }) => ({ id, name: username }));

  const {
    data: post,
    refetch: refetchPost,
    isFetching: postIsFetching,
    isLoading: postIsLoading,
  } = useFetch("/hr/posts");

  const commentsFetchParameters = {
    offset: currentOffsetComments,
    limit: 10,
  };

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

  const toggleFullScreen = useCallback((post) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPicture(post);
  }, []);

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

  const commentAddHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postData?.data?.id);
    posts[referenceIndex]["total_comment"] += 1;
    refetchPostData();
  };

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

  const replyHandler = (comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  };

  const handleLinkPress = useCallback((url) => {
    Linking.openURL(url);
  }, []);

  const handleEmailPress = useCallback((email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

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

  const commentRefetchHandler = () => {
    setCurrentOffsetComments(0);
    setReloadComment(!reloadComment);
  };

  const commentEndReachedHandler = () => {
    if (comments.length !== comments.length + comment?.data.length) {
      setCurrentOffsetComments(currentOffsetComments + 10);
    }
  };

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
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

  const handleChange = (value) => {
    formik.handleChange("comments")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue?.split(" ").pop();
    setSuggestions(employees?.data.filter((employee) => employee?.name.toLowerCase().includes(lastWord.toLowerCase())));
  };

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
      <SafeAreaView style={styles.container}>
        {isReady ? (
          <>
            <View style={styles.header}>
              <PageHeader
                title="Post"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
            <ScrollView
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
                  toggleFullScreen={toggleFullScreen}
                  handleLinkPress={handleLinkPress}
                  handleEmailPress={handleEmailPress}
                  copyToClipboard={copyToClipboard}
                  employeeUsername={employeeUsername}
                  navigation={navigation}
                />
                <FeedCommentPost
                  postId={postId}
                  loggedEmployeeName={userSelector?.name}
                  loggedEmployeeImage={profile?.data?.image}
                  comments={comments}
                  commentIsFetching={commentIsFetching}
                  commentIsLoading={commentIsLoading}
                  refetchComment={refetchComment}
                  onEndReached={commentEndReachedHandler}
                  commentRefetchHandler={commentRefetchHandler}
                  parentId={commentParentId}
                  onSubmit={commentSubmitHandler}
                  onReply={replyHandler}
                  employeeUsername={employeeUsername}
                  employees={employees?.data}
                  reference={commentScreenSheetRef}
                />
              </View>
            </ScrollView>
            <FeedCommentFormPost
              loggedEmployeeImage={profile?.data?.image}
              loggedEmployeeName={userSelector?.name}
              parentId={commentParentId}
              renderSuggestions={renderSuggestions}
              handleChange={handleChange}
              formik={formik}
              suggestion={suggestions}
            />
          </>
        ) : (
          <></>
        )}
      </SafeAreaView>
      <ImageFullScreenModal isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} file_path={selectedPicture} />
    </>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
