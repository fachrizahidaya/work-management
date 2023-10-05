import { Box } from "native-base";
import { FlashList } from "@shopify/flash-list";

import FeedCommentItem from "./FeedCommentItem";

const FeedCommentList = ({ comments, onReply, loggedEmployeeId, postId, latestExpandedReply, commentIsLoading }) => {
  return (
    <Box flex={1} minHeight={2}>
      <FlashList
        data={comments}
        keyExtractor={(item, index) => item.id}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <FeedCommentItem
            key={item.id}
            id={item.id}
            parentId={item.parent_id ? item.parent_id : item.id}
            loggedEmployeeId={loggedEmployeeId}
            authorId={item.employee_id}
            authorImage={item.employee_image}
            authorName={item.employee_name}
            totalReplies={item.total_replies}
            postId={postId}
            onReply={onReply}
            latestExpandedReply={latestExpandedReply}
            comments={item.comments}
          />
        )}
      />
    </Box>
  );
};

export default FeedCommentList;
