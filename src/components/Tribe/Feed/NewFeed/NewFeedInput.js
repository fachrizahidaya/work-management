import React, { useState } from "react";

import { Pressable, Text, ScrollView, Platform } from "react-native";
import {
  MentionInput,
  replaceMentionValues,
} from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";
import { TextProps } from "../../../shared/CustomStylings";

const NewFeedInput = ({ employees, formik }) => {
  const [suggestions, setSuggestions] = useState([]);

  const employeeData = employees?.map(({ id, username }) => ({
    id,
    name: username,
  }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData?.filter((one) =>
      one.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={() => onSuggestionPress(item)}
              style={{ padding: 12 }}
            >
              <Text style={[{ fontSize: 12 }, TextProps]}>{item.name}</Text>
            </Pressable>
          )}
        />
      </ScrollView>
    );
  };

  const handleChange = (value) => {
    formik.handleChange("content")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue.split(" ").pop();
    setSuggestions(
      employees?.filter((employee) =>
        employee.name.toLowerCase().includes(lastWord.toLowerCase())
      )
    );
  };

  return (
    <>
      <MentionInput
        value={formik.values.content}
        onChange={handleChange}
        partTypes={[
          {
            pattern:
              /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
          },
          {
            trigger: "@",
            renderSuggestions: renderSuggestions,
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
