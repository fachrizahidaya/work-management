import { Box, Flex, Text } from "native-base";
import { useEffect } from "react";
import { useState } from "react";
import { card } from "../../../../styles/Card";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const FeedCommentReplyItem = ({
  key,
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
    <Flex pl={5} flex={1} gap={5} style={card.card}>
      <Box flex={1} minHeight={1}>
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
      <Flex flexDir="row" gap={5}>
        <Box>Reply</Box>
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
