import React, { useState } from "react";

import { View, Pressable, Text } from "react-native";
import { MentionInput, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";

const NewFeedInput = ({ employees, formik }) => {
  const [suggestions, setSuggestions] = useState([]);

  const employeeData = employees.map(({ id, username }) => ({ id, name: username }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword === "@@" || keyword === "@#") {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <View style={{ height: 200 }}>
        <FlashList
          data={data}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <Pressable key={index} onPress={() => onSuggestionPress(item)} style={{ padding: 12 }}>
              <Text>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  const handleChange = (value) => {
    formik.handleChange("content")(value);
    const replacedValue = replaceMentionValues(value, ({ name }) => `@${name}`);
    const lastWord = replacedValue.split(" ").pop();
    setSuggestions(employees.filter((employee) => employee.name.toLowerCase().includes(lastWord.toLowerCase())));
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
            textStyle: { color: "blue" },
          },
          {
            trigger: "@",
            renderSuggestions: renderSuggestions,
          },
        ]}
        placeholder="Type something..."
        style={{ padding: 12 }}
      />
    </>
  );
};

export default NewFeedInput;
