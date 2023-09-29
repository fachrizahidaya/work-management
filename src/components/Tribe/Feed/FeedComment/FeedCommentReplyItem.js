import { useState, useEffect } from "react";

import { Box, Flex, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const FeedCommentReplyItem = ({
  id,
  parent_id,
  loggedEmployeeId,
  authorId,
  authorName,
  author_username,
  comments,
  totalReplies,
  postId,
  onReply,
  authorImage,
}) => {
  const [filteredComment, setFilteredComment] = useState();

  const filterComment = () => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    setFilteredComment(() => {
      return comments.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
    });
  };

  useEffect(() => {
    filterComment();
  }, [comments]);

  return (
    <Flex mx={10} my={2}>
      <Flex my={1} minHeight={1}>
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
            <Pressable
              disabled
              // onPress={() => onReply(parentId)}
            >
              <Text fontSize={12} fontWeight={500} color="#8A7373">
                Reply
              </Text>
            </Pressable>
          </Flex>
        </Flex>
      </Flex>
      {totalReplies > 0 && (
        <>
          <Box>
            <Text>{totalReplies}</Text>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default FeedCommentReplyItem;
