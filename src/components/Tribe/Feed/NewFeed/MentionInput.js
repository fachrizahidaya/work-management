import { useState, useEffect } from "react";

import { Box, Pressable, Text, TextArea } from "native-base";
import { MentionInput } from "react-native-controlled-mentions";

const MentionInputs = ({ employees, formik, name, onMentionSelect, inputRef }) => {
  const [value, setValue] = useState(null);
  console.log("emp", employees);

  const renderSuggestions =
    (suggestions) =>
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      return (
        <Box>
          {suggestions
            .filter((one, index) => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
            .map((one, index) => (
              <Pressable key={index} onPress={() => onSuggestionPress(one)} style={{ padding: 12 }}>
                <Text>{one.name}</Text>
              </Pressable>
            ))}
        </Box>
      );
    };

  const renderMentionSuggestions = renderSuggestions(employees);

  return (
    <>
      <MentionInput
        value={value}
        onChange={setValue}
        partTypes={[
          {
            trigger: "@",
            renderSuggestions: renderMentionSuggestions,
          },
          {
            pattern:
              /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
            textStyle: { color: "blue" },
          },
        ]}
        placeholder="Type here..."
      />
    </>
  );
};

export default MentionInputs;
