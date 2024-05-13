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
  handleWhenScrollReachedEnd,
  parentId,
  onReply,
  employeeUsername,
  reference,
  onPressLink,
  handleUsernameSuggestions,
  handleShowUsername,
  formik,
  setPostId,
  setCommentParentId,
  navigation,
  handleRefreshComments,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  return (
    <ActionSheet
      ref={reference}
      onClose={() => {
        handleClose(reference, setPostId, setCommentParentId);
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
          handleWhenScrollReachedEnd={handleWhenScrollReachedEnd}
          commentIsFetching={commentIsFetching}
          commentIsLoading={commentIsLoading}
          onPressLink={onPressLink}
          employeeUsername={employeeUsername}
          setCommentParentId={setCommentParentId}
          navigation={navigation}
          handleRefreshComments={handleRefreshComments}
        />
      </View>
      <FeedCommentForm
        loggedEmployeeImage={loggedEmployeeImage}
        loggedEmployeeName={loggedEmployeeName}
        parentId={parentId}
        renderSuggestions={handleUsernameSuggestions}
        handleChange={handleShowUsername}
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
