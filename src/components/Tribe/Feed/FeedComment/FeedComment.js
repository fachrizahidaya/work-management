import { useState, useCallback, memo } from "react";
import { useFormik } from "formik";

import { Clipboard, Linking, StyleSheet, View, Text, Pressable } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";

import FeedCommentList from "./FeedCommentList";
import FeedCommentForm from "./FeedCommentForm";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";

const FeedComment = ({
  postId,
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
  onSubmit,
  onReply,
  employeeUsername,
  employees,
  reference,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

  const employeeData = employees?.map(({ id, username }) => ({ id, name: username }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <View style={{ height: 100 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const handleChange = (value) => {
    formik.handleChange("comments")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue.split(" ").pop();
    setSuggestions(employees.filter((employee) => employee.name.toLowerCase().includes(lastWord.toLowerCase())));
  };

  /**
   * Create a new post handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      post_id: postId || "",
      comments: "",
      parent_id: parentId || "",
    },
    // validationSchema: yup.object().shape({
    //   comments: yup.string().required("Comments is required"),
    // }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
      const modifiedContent = values.comments.replace(mentionRegex, "@$1");
      values.comments = modifiedContent;
      onSubmit(values, setSubmitting, setStatus);
    },
  });

  const handleLinkPress = useCallback((url) => {
    Linking.openURL(url);
  }, []);

  const handleEmailPress = useCallback((email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const copyToClipboard = (text) => {
    try {
      if (typeof text !== String) {
        var textToCopy = text.toString();
        Clipboard.setString(textToCopy);
      } else {
        Clipboard.setString(text);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ActionSheet ref={reference} onClose={handleClose}>
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
          paddingBottom: 40,
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
          handleLinkPress={handleLinkPress}
          handleEmailPress={handleEmailPress}
          copyToClipboard={copyToClipboard}
          employeeUsername={employeeUsername}
        />

        <FeedCommentForm
          loggedEmployeeImage={loggedEmployeeImage}
          loggedEmployeeName={loggedEmployeeName}
          parentId={parentId}
          renderSuggestions={renderSuggestions}
          handleChange={handleChange}
          formik={formik}
          suggestion={suggestions}
        />
      </View>
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
