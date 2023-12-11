import React, { useState } from "react";
import { Box, Pressable, Text, TextArea } from "native-base";
import { MentionInput, mentionRegEx, replaceMentionValues } from "react-native-controlled-mentions";
import { FlashList } from "@shopify/flash-list";

const MentionInputs = ({ employees, formik, name, onMentionSelect, inputRef }) => {
  const [suggestions, setSuggestions] = useState([]);

  const employeeData = employees.map(({ id, username }) => ({ id, name: username }));

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }
    const data = employeeData.filter((one) => one.name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <Box height={200}>
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
      </Box>
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
        placeholder="Type here..."
        style={{ padding: 12 }}
      />
    </>
  );
};

export default MentionInputs;
