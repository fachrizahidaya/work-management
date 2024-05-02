import { Linking } from "react-native";
import Toast from "react-native-root-toast";

import axiosInstance from "../../../../config/api";
import { ErrorToastProps } from "../../../shared/CustomStylings";

/**
 * Handle fetch comment from first offset
 * After create a new comment, it will return to the first offset
 */
export const refetchCommentHandler = (setCurrentOffsetComments, setReloadComment, reloadComment) => {
  setCurrentOffsetComments(0);
  setReloadComment(!reloadComment);
};

/**
 * Handle open comment Action sheet
 */
export const openCommentHandler = (post_id, reference, setPostId) => {
  reference.current?.show();
  setPostId(post_id);
};

/**
 * Handle close comment Action sheet
 */
export const closeCommentHandler = (reference, setPostId, setCommentParentId) => {
  reference.current?.hide();
  setPostId(null);
  setCommentParentId(null);
};

/**
 * Handle add comment
 */
export const addCommentHandler = (posts, postId, setForceRerender, forceRerender) => {
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
export const submitCommentHandler = async (
  data,
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
) => {
  try {
    await axiosInstance.post(`/hr/posts/comment`, data);
    refetchCommentHandler(setCurrentOffsetComments, setReloadComment, reloadComment);
    addCommentHandler(posts, postId, setForceRerender, forceRerender);
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
export const likePostHandler = async (post_id, action) => {
  try {
    await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
    console.log("Process success");
  } catch (err) {
    console.log(err);
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};

/**
 * Handle toggle reply comment
 */
export const replyCommentHandler = (comment_parent_id, setCommentParentId) => {
  setCommentParentId(comment_parent_id);
};

/**
 * Handle toggle fullscreen image
 */
export const toggleFullScreenImageHandler = (image, isFullScreen, setIsFullScreen, setSelectedPicture) => {
  setIsFullScreen(!isFullScreen);
  setSelectedPicture(image);
};

/**
 * Handle press link
 */
export const pressLinkHandler = (url) => {
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
};
