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
    <Flex gap={3}>
      <Flex mt={1} minHeight={1}>
        <Flex direction="row" gap={2}>
          <Flex>
            <AvatarPlaceholder image={authorImage} name={authorName} size="sm" />
          </Flex>
          <Flex flex={1} gap={1}>
            <Text fontSize={12} fontWeight={500}>
              {authorName.length > 30 ? authorName.split(" ")[0] : authorName}
            </Text>
            <Text fontSize={12} fontWeight={400}>
              {comments}
            </Text>
            <Pressable onPress={() => onReply(parentId)}>
              <Text color="#8A7373">Reply</Text>
            </Pressable>
          </Flex>
        </Flex>
        {!totalReplies ? (
          ""
        ) : (
          <Box mx={10} my={5}>
            <Pressable onPress={() => fetchReply()}>
              <Flex flexDir="row">
                View{totalReplies ? ` ${totalReplies}` : ""} {totalReplies > 1 ? "Replies" : "Reply"}
              </Flex>
            </Pressable>
          </Box>
        )}
        {totalReplies > 0 && (
          <Box flex={1} minHeight={2}>
            <FlashList
              data={commentReplies}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              estimatedItemSize={200}
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
        )}
      </Flex>
    </Flex>
  );
};

export default FeedCommentItem;
