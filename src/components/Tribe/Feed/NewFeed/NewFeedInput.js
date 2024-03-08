import React, { useRef, useState } from "react";

import { Pressable, Text, ScrollView, Platform, View } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { TextProps } from "../../../shared/CustomStylings";

const NewFeedInput = ({ employees, formik }) => {
  const richText = useRef(null);

  /**
   * Handle show username suggestion option
   */
  const employeeData = employees?.map(({ id, username }) => ({
    id,
    name: username,
  }));

  /**
   * Handle show suggestion username
   * @param {*} param0
   * @returns
   */
  const renderSuggestionsHandler = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData?.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text style={[{ fontSize: 12 }, TextProps]}>{item.name}</Text>
            </Pressable>
          )}
        />
      </ScrollView>
    );
  };

  const preprocessContent = (content) => {
    return content.replace(/<p><\/p>/g, "<br/>");
  };

  /**
   * Handle adjust the content if there is username
   * @param {*} value
   */
  const contentUsernameChangeHandler = (value) => {
    formik.handleChange("content")(value);
    // const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    // const lastWord = replacedValue.split(" ").pop();
  };

  return (
    <>
      {/* <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.setUnderline,
        ]}
        iconTint="#000000"
        selectedIconTint="#176688"
      /> */}
      {/* <View style={{ height: 200 }}>
        <RichEditor
          ref={richText}
          onChange={contentUsernameChangeHandler}
          initialContentHTML={preprocessContent(formik.values.content)}
          style={{ flex: 1, borderWidth: 0.5, borderRadius: 10, borderColor: "#E8E9EB" }}
          editorStyle={{
            contentCSSText: `
                      display: flex; 
                      flex-direction: column; 
                      min-height: 200px; 
                      position: absolute; 
                      top: 0; right: 0; bottom: 0; left: 0;`,
          }}
        />
      </View> */}
      <MentionInput
        value={formik.values.content}
        onChange={contentUsernameChangeHandler}
        partTypes={[
          {
            pattern:
              /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
          },
          {
            trigger: "@",
            renderSuggestions: renderSuggestionsHandler,
            textStyle: {
              fontWeight: "400",
              color: "#377893",
            },
          },
        ]}
        placeholder="Type something..."
        style={{ padding: 12, paddingTop: Platform.OS === "ios" ? 12 : null }}
      />
    </>
  );
};

export default NewFeedInput;
