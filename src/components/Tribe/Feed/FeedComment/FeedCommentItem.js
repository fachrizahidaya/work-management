import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar, Box, FlatList, Flex, Pressable, Text } from "native-base";
import axiosInstance from "../../../../config/api";
import { card } from "../../../../styles/Card";
import { Dimensions, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import FeedCommentReplyItem from "./FeedCommentReplyItem";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import CustomAccordion from "../../../shared/CustomAccordion";

const FeedCommentItem = ({
  key,
  id,
  parent_id,
  loggedEmployeeId,
  authorId,
  authorImage,
  author_name,
  total_replies,
  postId,
  onReply,
  latestExpandedReply,
  comments,
}) => {
  const [commentReplies, setCommentReplies] = useState(false);
  const [filteredComment, setFileteredComment] = useState(false);
  const [replyFetchDone, setReplyFetchDone] = useState(false);

  const fetchReply = async (fetchMore = false) => {
    if (!replyFetchDone) {
      try {
        const res = await axiosInstance.get(`/hr/posts/${postId}/comment/${parent_id}/replies`);
        if (!fetchMore) {
          setCommentReplies(res.data.data);
        } else {
          setCommentReplies((prevState) => {
            if (prevState.length !== prevState.length + res.data.data.length) {
              return [...prevState, ...res.data.data];
            } else {
              setReplyFetchDone(true);
              return prevState;
            }
          });
        }
        console.log("reply", commentReplies);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filterComment = () => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    setFileteredComment(() => {
      return comments.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
    });
  };

  useEffect(() => {
    filterComment();
  }, [comments]);

  return (
    <Flex mt={1} mb={5} flex={1} gap={3}>
      <Box flex={1} mt={1} minHeight={1}>
        <Flex direction="row" gap={4}>
          <AvatarPlaceholder image={authorImage} name={author_name} size="sm" />
          <Box>
            <Text fontSize={15} fontWeight={700}>
              {author_name.length > 30 ? author_name.split(" ")[0] : author_name}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Text>{comments}</Text>
      <Flex flexDir="row" ml={3} gap={5}>
        <Box>Reply</Box>
        <Pressable onPress={() => fetchReply()}>
          <Flex flexDir="row">View{total_replies ? ` ${total_replies}` : ""} Reply</Flex>
        </Pressable>
        {/* <CustomAccordion title={"View Reply"} subTitle={total_replies} hasAction={fetchReply}>
          <Box>
            <FlatList
              data={commentReplies}
              renderItem={({ item }) => (
                <FeedCommentReplyItem
                  key={item.id}
                  id={item.id}
                  parent_id={item.parent_id ? item.parent_id : item.id}
                  loggedEmployeeId={loggedEmployeeId}
                  authorId={item?.emloyee_id}
                  authorName={item?.employee_name}
                  authorImage={item?.employee_image}
                  author_username={item?.employee_username}
                  comments={item?.comments}
                  totalReplies={item?.total_replies}
                  postId={postId}
                  onReply={onReply}
                  />
                  )}
                  />
          </Box>
        </CustomAccordion> */}
      </Flex>
      {total_replies > 0 && (
        <>
          <Box>
            <FlatList
              data={commentReplies}
              renderItem={({ item }) => (
                <FeedCommentReplyItem
                  key={item.id}
                  id={item.id}
                  parent_id={item.parent_id ? item.parent_id : item.id}
                  loggedEmployeeId={loggedEmployeeId}
                  authorId={item?.emloyee_id}
                  authorName={item?.employee_name}
                  authorImage={item?.employee_image}
                  author_username={item?.employee_username}
                  comments={item?.comments}
                  totalReplies={item?.total_replies}
                  postId={postId}
                  onReply={onReply}
                />
              )}
            />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default FeedCommentItem;
