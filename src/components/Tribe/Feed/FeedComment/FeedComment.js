import { memo, useState } from "react";

import { Flex, ScrollView, Text, Actionsheet } from "native-base";
import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";

const FeedComment = ({
  postId,
  loggedEmployeeId,
  loggedEmployeeName,
  loggedEmployeeImage,
  commentIsFetching,
  commentIsLoading,
  comments,
  handleOpen,
  handleClose,
  refetchComment,
  onEndReached,
  commentRefetchHandler,
  parentId,
  onSubmit,
  onReply,
  latestExpandedReply,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  return (
    <Actionsheet isOpen={handleOpen} onClose={handleClose}>
      <Actionsheet.Content>
        <Flex flexDir="column" justifyContent="center">
          <Flex
            flexDir="row"
            alignItems="center"
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor="#DBDBDB"
          >
            <Flex mb={2} alignItems="center">
              <Text fontSize={15} fontWeight={500}>
                Comments
              </Text>
            </Flex>
          </Flex>
          <ScrollView flex={1} style={{ maxHeight: 600 }}>
            <Flex gap={1} mt={1} flex={1}>
              <FeedCommentList
                comments={comments}
                postId={postId}
                loggedEmployeeId={loggedEmployeeId}
                latestExpandedReply={latestExpandedReply}
                hasBeenScrolled={hasBeenScrolled}
                setHasBeenScrolled={setHasBeenScrolled}
                onReply={onReply}
                commentEndReachedHandler={onEndReached}
                commentsRefetchHandler={commentRefetchHandler}
                commentIsFetching={commentIsFetching}
                commentIsLoading={commentIsLoading}
                refetchComment={refetchComment}
              />
            </Flex>
          </ScrollView>

          <FeedCommentForm
            postId={postId}
            loggedEmployeeImage={loggedEmployeeImage}
            loggedEmployeeName={loggedEmployeeName}
            parentId={parentId}
            onSubmit={onSubmit}
          />
        </Flex>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default memo(FeedComment);
