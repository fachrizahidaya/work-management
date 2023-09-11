import { Avatar, Box, Flex, Image, Text, ScrollView, Skeleton, Icon, Pressable } from "native-base";
import { Dimensions } from "react-native";
import { card } from "../../../styles/Card";
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FeedCardItem from "./FeedCardItem";
import FeedComment from "./FeedComment/FeedComment";

const FeedCard = ({ feeds, feedIsLoading, loggedEmployeeId, loggedEmployeeImage, onToggleLike, postFetchDone }) => {
  const [postEditOpen, setPostEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [postTotalComment, setPostTotalComment] = useState(0);
  const [editedPost, setEditedPost] = useState(null);
  const [postIsFetching, setPostIsFetching] = useState(false);
  const [postId, setPostId] = useState(null);

  const commentsOpenHandler = (post_id) => {
    setCommentsOpen(false);
    setPostId(post_id);
    const togglePostComment = feeds.find((post) => post.id === post_id);
    setPostTotalComment(togglePostComment.total_comment);
  };

  const commentsCloseHandler = () => {
    setCommentsOpen(false);
    setPostId(null);
  };

  const commentSubmitHandler = () => {
    setPostTotalComment((prevState) => {
      return prevState + 1;
    });
    const referenceIndex = feeds.findIndex((post) => post.id === postId);
    feeds[referenceIndex]["total_comment"] += 1;
  };

  return (
    <>
      {!feedIsLoading ? (
        <>
          <ScrollView flex={3} showsVerticalScrollIndicator={false} bounces={false}>
            <FlashList
              data={feeds}
              onEndReachedThreshold={0.1}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <FeedCardItem
                  key={item?.id}
                  loggedEmployeeId={loggedEmployeeId}
                  loggedEmployeeImage={loggedEmployeeImage}
                  onToggleLike={onToggleLike}
                  onCommentToggle={commentsOpenHandler}
                  post={item}
                  id={item?.id}
                  employee_name={item?.employee_name}
                  created_at={item?.created_at}
                  employee_image={item?.employee_image}
                  content={item?.content}
                  total_like={item?.total_like}
                  total_comment={item?.total_comment}
                  liked_by={item?.liked_by}
                  attachment={item?.file_path}
                />
              )}
            />
            <FeedComment
              handleOpen={commentsOpen}
              handleClose={commentsCloseHandler}
              loggedEmployeeId={loggedEmployeeId}
              loggedEmployeeImage={loggedEmployeeImage}
              postId={postId}
              total_comment={postTotalComment}
              onSubmit={commentSubmitHandler}
            />
          </ScrollView>
        </>
      ) : (
        <Skeleton h={40} />
      )}
    </>
  );
};

export default FeedCard;
