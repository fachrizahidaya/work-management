import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";
import FeedCard from "../../../components/Tribe/Employee/FeedPersonal/FeedCard";
import FeedComment from "../../../components/Tribe/Employee/FeedPersonal/FeedComment";
import EditPost from "../../../components/Tribe/Employee/FeedPersonal/EditPost";
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";

const EmployeeProfileScreen = ({ route }) => {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [reloadPost, setReloadPost] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [currentOffsetPost, setCurrentOffsetPost] = useState(0);
  const [currentOffsetComment, setCurrentOffsetComment] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [postId, setPostId] = useState(null);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);
  const [commentParentId, setCommentParentId] = useState(null);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { employeeId, loggedEmployeeImage, loggedEmployeeId } = route.params;

  const commentsScreenSheetRef = useRef(null);

  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: editModalIsOpen, toggle: toggleEditModal } = useDisclosure(false);

  const { height } = Dimensions.get("screen");

  const navigation = useNavigation();

  const userSelector = useSelector((state) => state.auth); // User redux to fetch id, name

  const { data: employee } = useFetch(`/hr/employees/${employeeId}`);

  const { data: teammates } = useFetch(`/hr/employees/${employeeId}/team`);

  const { data: profile } = useFetch("/hr/my-profile");

  const { data: employees, isFetching: employeesIsFetching, refetch: refetchEmployees } = useFetch("/hr/employees");
  const employeeUsername = employees?.data?.map((item, index) => {
    return {
      username: item.username,
      id: item.id,
      name: item.name,
    };
  });

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffsetPost,
    limit: 5,
  };

  const {
    data: personalPost,
    refetch: refetchPersonalPost,
    isFetching: personalPostIsFetching,
    isLoading: personalPostIsLoading,
  } = useFetch(`/hr/posts/personal/${employee?.data?.id}`, [reloadPost, currentOffsetPost], postFetchParameters);

  const { data: singlePost } = useFetch(`/hr/posts/${selectedPost}`);

  // Parameters for fetch comments
  const commentsFetchParameters = {
    offset: currentOffsetComment,
    limit: 10,
  };

  const {
    data: comment,
    isFetching: commentIsFetching,
    isLoading: commentIsLoading,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [reloadComment, currentOffsetComment], commentsFetchParameters);

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (posts.length !== posts.length + personalPost?.data.length) {
      setCurrentOffsetPost(currentOffsetPost + 10);
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
      setCurrentOffsetComment(currentOffsetComment + 10);
    }
  };

  /**
   * Fetch from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffsetComment(0);
    setReloadComment(!reloadComment);
  };

  /**
   * Comments open handler
   */
  const commentsOpenHandler = (post_id) => {
    commentsScreenSheetRef.current?.show();
    setPostId(post_id);
    const togglePostComment = posts.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  const commentsCloseHandler = () => {
    commentsScreenSheetRef.current?.hide();
    setPostId(null);
  };

  /**
   * Comment submit handler
   */
  const commentAddHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = posts.findIndex((post) => post.id === postId);
    posts[referenceIndex]["total_comment"] += 1;
    // refetchPersonalPost();
    setForceRerender(!forceRerender);
  };

  const openSelectedPersonalPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

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
      setCommentParentId(null);
      commentAddHandler(postId);
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
   * Control for reply a comment
   */
  const replyHandler = useCallback((comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  }, []);

  /**
   * Toggle fullscreen image
   */
  const toggleFullScreen = useCallback((post) => {
    setSelectedPost(post);
    setIsFullScreen(!isFullScreen);
  }, []);

  /**
   * Edit a post handler
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const postEditHandler = async (form, setSubmitting, setStatus) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/hr/posts/${selectedPost}`, form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setSubmitting(false);
      setStatus("success");
      postRefetchHandler();
      setIsLoading(false);
      toggleEditModal();
      Toast.show("Edited successfully!", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setIsLoading(false);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (result) {
      setImage({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  useEffect(() => {
    if (personalPost?.data && personalPostIsFetching === false) {
      if (currentOffsetPost === 0) {
        setPosts(personalPost?.data);
      } else {
        setPosts((prevData) => [...prevData, ...personalPost?.data]);
      }
    }
  }, [personalPostIsFetching, reloadPost]);

  useEffect(() => {
    if (!commentsOpenHandler) {
      setCommentParentId(null);
    } else {
      if (comment?.data && commentIsFetching === false) {
        if (currentOffsetComment === 0) {
          setComments(comment?.data);
        } else {
          setComments((prevData) => [...prevData, ...comment?.data]);
        }
      }
    }
  }, [commentIsFetching, commentParentId, reloadComment]);

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
            <>
              <View style={isHeaderSticky ? styles.stickyHeader : styles.header}>
                <PageHeader
                  title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
              <View style={styles.content} height={height}>
                {/* Content here */}
                <FeedCard
                  posts={posts}
                  loggedEmployeeId={loggedEmployeeId}
                  loggedEmployeeImage={loggedEmployeeImage}
                  postEndReachedHandler={postEndReachedHandler}
                  personalPostIsFetching={personalPostIsFetching}
                  refetchPersonalPost={refetchPersonalPost}
                  employee={employee}
                  teammates={teammates}
                  hasBeenScrolled={hasBeenScrolled}
                  setHasBeenScrolled={setHasBeenScrolled}
                  onCommentToggle={commentsOpenHandler}
                  forceRerender={forceRerender}
                  setForceRerender={setForceRerender}
                  personalPostIsLoading={personalPostIsLoading}
                  toggleFullScreen={toggleFullScreen}
                  openSelectedPersonalPost={openSelectedPersonalPost}
                  employeeUsername={employeeUsername}
                  userSelector={userSelector}
                  toggleDeleteModal={toggleDeleteModal}
                  toggleEditModal={toggleEditModal}
                />

                <FeedComment
                  postId={postId}
                  loggedEmployeeName={userSelector?.name}
                  loggedEmployeeImage={profile?.data?.image}
                  comments={comments}
                  commentIsFetching={commentIsFetching}
                  commentIsLoading={commentIsLoading}
                  refetchComment={refetchComment}
                  handleOpen={commentsOpenHandler}
                  handleClose={commentsCloseHandler}
                  onEndReached={commentEndReachedHandler}
                  commentRefetchHandler={commentRefetchHandler}
                  parentId={commentParentId}
                  onSubmit={commentSubmitHandler}
                  onReply={replyHandler}
                  latestExpandedReply={latestExpandedReply}
                  employees={employees?.data}
                  employeeUsername={employeeUsername}
                  reference={commentsScreenSheetRef}
                />
              </View>
            </>
          </>
        ) : null}
      </SafeAreaView>
      <ImageFullScreenModal isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} file_path={selectedPost} />
      <EditPost
        isVisible={editModalIsOpen}
        onBackdrop={toggleEditModal}
        employees={employees?.data}
        content={singlePost?.data}
        image={image}
        setImage={setImage}
        postEditHandler={postEditHandler}
        pickImageHandler={pickImageHandler}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <ConfirmationModal
        isOpen={deleteModalIsOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/hr/posts/${selectedPost}`}
        color="red.800"
        hasSuccessFunc={true}
        onSuccess={() => {
          refetchPersonalPost();
        }}
        description="Are you sure to delete this post?"
        successMessage="Post deleted"
        isDelete={true}
        isPatch={false}
      />
    </>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    gap: 5,
    minHeight: 2,
  },
});
