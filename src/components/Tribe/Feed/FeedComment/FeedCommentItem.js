import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Flex, Pressable, Text } from "native-base";
import axiosInstance from "../../../../config/api";
import { card } from "../../../../styles/Card";
import { useState } from "react";
import { useEffect } from "react";
import FeedCommentReplyItem from "./FeedCommentReplyItem";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import CustomAccordion from "../../../shared/CustomAccordion";
import { FlashList } from "@shopify/flash-list";

const FeedCommentItem = ({
  id,
  parentId,
  loggedEmployeeId,
  authorId,
  authorImage,
  authorName,
  totalReplies,
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
        const res = await axiosInstance.get(`/hr/posts/${postId}/comment/${parentId}/replies`);
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
          <AvatarPlaceholder image={authorImage} name={authorName} size="sm" />
          <Box>
            <Text fontSize={15} fontWeight={700}>
              {authorName.length > 30 ? authorName.split(" ")[0] : authorName}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Text>{comments}</Text>
      <Flex flexDir="row" ml={3} gap={5}>
        <Pressable onPress={() => onReply(parentId)}>
          <Box>Reply</Box>
        </Pressable>
        <Pressable onPress={() => fetchReply()}>
          <Flex flexDir="row">View{totalReplies ? ` ${totalReplies}` : ""} Reply</Flex>
        </Pressable>
      </Flex>
      {totalReplies > 0 && (
        <>
          <Box>
            <FlashList
              data={commentReplies}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              estimatedItemSize={100}
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
