import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar, Box, FlatList, Flex, Pressable, Text } from "native-base";
import axiosInstance from "../../../../config/api";
import { card } from "../../../../styles/Card";
import { Dimensions, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import FeedCommentReplyItem from "./FeedCommentReplyItem";

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
        console.log(commentReplies);
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
    <Flex flex={1} gap={5} style={card.card}>
      <Box flex={1} minHeight={1}>
        <Flex direction="row" gap={4}>
          <Avatar size="sm" source={{ uri: `https://dev.kolabora-app.com/api-dev/image/${authorImage}/thumb` }} />
          <Box>
            <Text fontSize={15} fontWeight={700}>
              {author_name.length > 30 ? author_name.split(" ")[0] : author_name}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Text>{comments}</Text>
      <Flex flexDir="row" gap={5}>
        <Box>Reply</Box>
        <Pressable onPress={() => fetchReply()}>
          <Box>View Reply</Box>
        </Pressable>
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
                  authorId={item.emloyee_id}
                  authorName={item.employee_name}
                  authorImage={item.employee_image}
                  author_username={item.employee_username}
                  comments={item.comments}
                  totalReplies={item.total_replies}
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
