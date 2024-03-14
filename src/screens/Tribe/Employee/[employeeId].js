import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import _ from "lodash";

import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import ImageFullScreenModal from "../../../components/shared/ImageFullScreenModal";
import FeedCard from "../../../components/Tribe/Employee/FeedPersonal/FeedCard";
import FeedComment from "../../../components/Tribe/Employee/FeedPersonal/FeedComment";
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import EmployeeTeammates from "../../../components/Tribe/Employee/EmployeeTeammates";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";
import EditPersonalPost from "../../../components/Tribe/Employee/FeedPersonal/EditPersonalPost";

const EmployeeProfileScreen = ({ route }) => {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [reloadPost, setReloadPost] = useState(false);
  const [reloadComment, setReloadComment] = useState(false);
  const [currentOffsetPost, setCurrentOffsetPost] = useState(0);
  const [currentOffsetComment, setCurrentOffsetComment] = useState(0);
  const [postId, setPostId] = useState(null);
  const [forceRerender, setForceRerender] = useState(false);
  const [commentParentId, setCommentParentId] = useState(null);
  const [latestExpandedReply, setLatestExpandedReply] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [inputToShow, setInputToShow] = useState("");
  const [filteredType, setFilteredType] = useState([]);
  const [teammatesData, setTeammatesData] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [deletePostSuccess, setDeletePostSuccess] = useState(false);
  const [imageToShare, setImageToShare] = useState(null);
  const [requestType, setRequestType] = useState("");

  const navigation = useNavigation();

  const { height } = Dimensions.get("screen");

  const { employeeId, loggedEmployeeImage, loggedEmployeeId } = route.params;

  const commentsScreenSheetRef = useRef(null);
  const teammatesScreenSheetRef = useRef(null);

  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: editModalIsOpen, toggle: toggleEditModal } = useDisclosure(false);
  const { isOpen: updatePostModalIsOpen, toggle: toggleUpdatePostModal } = useDisclosure(false);
  const { isOpen: deletePostModalIsOpen, toggle: toggleDeletePostModal } = useDisclosure(false);

  const userSelector = useSelector((state) => state.auth);
  const menuSelector = useSelector((state) => state.user_menu.user_menu.menu);

  const checkAccess = menuSelector[1].sub[2]?.actions.create_announcement;

  const fetchTeammatesParameters = {
    search: searchInput,
  };

  const postFetchParameters = {
    offset: currentOffsetPost,
    limit: 10,
  };

  const commentsFetchParameters = {
    offset: currentOffsetComment,
    limit: 10,
  };

  const { data: employee } = useFetch(`/hr/employees/${employeeId}`);

  const {
    data: personalPost,
    refetch: refetchPersonalPost,
    isFetching: personalPostIsFetching,
    isLoading: personalPostIsLoading,
  } = useFetch(`/hr/posts/personal/${employee?.data?.id}`, [reloadPost, currentOffsetPost], postFetchParameters);

  const {
    data: comment,
    isFetching: commentIsFetching,
    isLoading: commentIsLoading,
    refetch: refetchComment,
  } = useFetch(`/hr/posts/${postId}/comment`, [reloadComment, currentOffsetComment], commentsFetchParameters);

  const { data: singlePost } = useFetch(`/hr/posts/${selectedPost}`);

  const { data: teammates } = useFetch(`/hr/employees/${employeeId}/team`, [searchInput], fetchTeammatesParameters);

  const { data: profile } = useFetch("/hr/my-profile");

  const { data: employees } = useFetch("/hr/employees");

  /**
   * Handle show username in post
   */
  const objectContainEmployeeUsernameHandler = employees?.data?.map((item, index) => {
    return {
      username: item.username,
      id: item.id,
      name: item.name,
    };
  });

  /**
   * Handle Fetch more Posts
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (posts.length !== posts.length + personalPost?.data.length) {
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
      setCurrentOffsetComment(currentOffsetComment + 10);
    }
  };

  /**
   * Handle fetch comment from first offset
   * After create a new comment, it will return to the first offset
   */
  const commentRefetchHandler = () => {
    setCurrentOffsetComment(0);
    setReloadComment(!reloadComment);
  };

  /**
   * Handle open comment Action sheet
   */
  const commentsOpenHandler = (post_id) => {
    commentsScreenSheetRef.current?.show();
    setPostId(post_id);
    const togglePostComment = posts.find((post) => post.id === post_id);
  };

  /**
   * Handle close comment Action sheet
   */
  const commentsCloseHandler = () => {
    commentsScreenSheetRef.current?.hide();
    setPostId(null);
    setCommentParentId(null);
    setLatestExpandedReply(null);
  };

  /**
   * Handle open option selected post
   */
  const openSelectedPersonalPostHandler = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  /**
   * Handle close option selected post
   */
  const closeSelectedPersonalPostHandler = () => {
    setSelectedPost(null);
    setImagePreview(null);
    toggleEditModal();
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
   * Handle toggle fullscreen image
   */
  const toggleFullScreenHandler = useCallback((image) => {
    setIsFullScreen(!isFullScreen);
    setSelectedPost(image);
    setImageToShare(image);
  }, []);

  /**
   * Handle toggle reply comment
   */
  const replyHandler = useCallback((comment_parent_id) => {
    setCommentParentId(comment_parent_id);
    setLatestExpandedReply(comment_parent_id);
  }, []);

  /**
   * Handle search teammates
   */
  const teammatesSearchHandler = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 300),
    []
  );

  /**
   * Handle Submit a comment
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
   * Handle edit a post
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
      setPosts([]);
      postRefetchHandler();
      setIsLoading(false);
      toggleUpdatePostModal();
      setRequestType("success");
      // Toast.show("Edited successfully!", SuccessToastProps);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setIsLoading(false);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle pick an image
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
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
    setFilteredType([]);
  }, [searchInput]);

  useEffect(() => {
    if (teammates?.data.length) {
      if (!searchInput) {
        setTeammatesData((prevData) => [...prevData, ...teammates?.data]);
        setFilteredType([]);
      } else {
        setFilteredType((prevData) => [...prevData, ...teammates?.data]);
        setTeammatesData([]);
      }
    }
  }, [teammates]);

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
              <View style={styles.header}>
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
                  toggleFullScreen={toggleFullScreenHandler}
                  openSelectedPersonalPost={openSelectedPersonalPostHandler}
                  employeeUsername={objectContainEmployeeUsernameHandler}
                  userSelector={userSelector}
                  toggleDeleteModal={toggleDeleteModal}
                  toggleEditModal={toggleEditModal}
                  reference={teammatesScreenSheetRef}
                  navigation={navigation}
                  postRefetchHandler={postRefetchHandler}
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
                  employeeUsername={objectContainEmployeeUsernameHandler}
                  reference={commentsScreenSheetRef}
                />
              </View>
            </>
          </>
        ) : null}
      </SafeAreaView>
      <ImageFullScreenModal
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        file_path={selectedPost}
        image={imageToShare}
        setImage={setImageToShare}
        setSelectedPicture={setSelectedPost}
        toggleSuccess={null}
        navigation={navigation}
        postRefetch={postRefetchHandler}
        loggedEmployeeId={profile?.data?.id}
        loggedEmployeeImage={profile?.data?.image}
        loggedEmployeeName={userSelector?.name}
        loggedEmployeeDivision={profile?.data?.position_id}
        type="Feed"
      />
      <EditPersonalPost
        isVisible={editModalIsOpen}
        onBackdrop={closeSelectedPersonalPostHandler}
        employees={employees?.data}
        content={singlePost?.data}
        image={image}
        setImage={setImage}
        postEditHandler={postEditHandler}
        pickImageHandler={pickImageHandler}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        checkAccess={checkAccess}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        updatePostModalIsOpen={updatePostModalIsOpen}
        toggleUpdatePostModal={toggleUpdatePostModal}
        requestType={requestType}
      />
      <ConfirmationModal
        isOpen={deleteModalIsOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/hr/posts/${selectedPost}`}
        color="red.800"
        hasSuccessFunc={true}
        onSuccess={() => {
          setDeletePostSuccess(true);
          setPosts([]);
          setRequestType("danger");
          postRefetchHandler();
        }}
        description="Are you sure to delete this post?"
        successMessage={"Post deleted"}
        isDelete={true}
        isPatch={false}
        toggleOtherModal={toggleDeletePostModal}
        successStatus={deletePostSuccess}
        showSuccessToast={false}
      />
      <EmployeeTeammates
        teammates={filteredType.length > 0 ? filteredType : teammatesData}
        reference={teammatesScreenSheetRef}
        handleSearch={teammatesSearchHandler}
        inputToShow={inputToShow}
        setInputToShow={setInputToShow}
        setSearchInput={setSearchInput}
      />
      <SuccessModal
        isOpen={deletePostModalIsOpen}
        toggle={toggleDeletePostModal}
        type={requestType}
        title="Changes saved!"
        description="Data has successfully deleted"
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
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
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
