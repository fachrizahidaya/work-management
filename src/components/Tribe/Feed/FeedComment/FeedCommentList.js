import { Box, FlatList, ScrollView } from "native-base";
import FeedCommentItem from "./FeedCommentItem";
import { FlashList } from "@shopify/flash-list";

const FeedCommentList = ({ comments, onReply, loggedEmployeeId, postId, latestExpandedReply, commentIsLoading }) => {
  return (
    <Box flex={1} minHeight={2}>
      <FlashList
        inverted
        data={comments}
        keyExtractor={(item, index) => item.id}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <FeedCommentItem
            key={item.id}
            id={item.id}
            parent_id={item.parent_id ? item.parent_id : item.id}
            loggedEmployeeId={loggedEmployeeId}
            authorId={item.employee_id}
            authorImage={item.employee_image}
            author_name={item.employee_name}
            total_replies={item.total_replies}
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
