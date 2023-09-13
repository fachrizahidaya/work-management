import { FlatList } from "native-base";
import FeedCommentItem from "./FeedCommentItem";

const FeedCommentList = ({ comments, onReply, loggedEmployeeId, postId, latestExpandedReply }) => {
  return (
    <>
      <FlatList
        data={comments}
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
    </>
  );
};

export default FeedCommentList;
