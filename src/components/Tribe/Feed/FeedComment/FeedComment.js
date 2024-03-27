import { useState, memo } from "react";

import { StyleSheet, View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";

const FeedComment = ({
  loggedEmployeeName,
  loggedEmployeeImage,
  commentIsFetching,
  commentIsLoading,
  comments,
  handleClose,
  refetchComment,
  onEndReached,
  commentRefetchHandler,
  parentId,
  onReply,
  employeeUsername,
  reference,
  onPressLink,
  onSuggestions,
  commentContainUsernameHandler,
  formik,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  return (
    <ActionSheet
      ref={reference}
      onClose={() => {
        handleClose();
      }}
    >
      <View style={styles.header}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>Comments</Text>
        </View>
      </View>

      <View
        style={{
          gap: 21,
          paddingHorizontal: 20,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <FeedCommentList
          comments={comments}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
          onReply={onReply}
          commentEndReachedHandler={onEndReached}
          commentsRefetchHandler={commentRefetchHandler}
          commentIsFetching={commentIsFetching}
          commentIsLoading={commentIsLoading}
          refetchComment={refetchComment}
          handleLinkPress={onPressLink}
          employeeUsername={employeeUsername}
        />
      </View>
      <FeedCommentForm
        loggedEmployeeImage={loggedEmployeeImage}
        loggedEmployeeName={loggedEmployeeName}
        parentId={parentId}
        renderSuggestions={onSuggestions}
        handleChange={commentContainUsernameHandler}
        formik={formik}
      />
    </ActionSheet>
  );
};

export default memo(FeedComment);

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
    marginTop: 15,
  },
});
