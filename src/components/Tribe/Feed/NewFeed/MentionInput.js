import { useState, useEffect } from "react";
import { Mention, MentionsInput } from "react-mentions";

import { Text, TextArea } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import MentionSelect from "./MentionSelect";

const MentionInput = ({ employees, formik, name, onMentionSelect, inputRef }) => {
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [testFormattedContent, setTestFormattedContent] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [mentions, setMentions] = useState([]);

  const mentionToggleHandler = (e) => {
    if (e.key !== "Shift") {
      const text = e.target.value.substring(0, e.target.selectionStart).match(/[a-zA-Z0-9-_@]+$/);
      const value = e.target.value.substring(0, e.target.selectionStart).match(/[a-zA-Z0-9-_]+$/);
      if (text && text[0][0] === "@" && text[0][1] !== "@") {
        setMentionOpen(true);
        setMentionFilter(value && value[0]);
      }
      if (!text || (text && text[0][0] === "@" && text[0][1] === "@")) {
        setMentionOpen(false);
        setMentionFilter("");
      }
    }
  };

  const mentionFilterHandler = () => {
    let filtered;
    if (mentionFilter) {
      filtered = employees.filter((employee) => {
        return employee.username.includes(mentionFilter);
      });
    } else {
      filtered = employees;
    }
    setFilteredEmployee(filtered);
  };

  const mentionSelectHandler = (username) => {
    let updatedTweet;
    const text = inputRef.current.value.substring(0, inputRef.current.selectionStart).match(/[a-zA-Z0-9-_@]+$/);
    updatedTweet = inputRef.current.value.replace(text[0], "@" + username + " ");
    onMentionSelect(updatedTweet);
    inputRef.current.focus();
    setMentionOpen(false);
    setMentionFilter("");
  };

  useEffect(() => {
    mentionFilterHandler();
  }, [mentionFilter]);

  return (
    <>
      <KeyboardAwareScrollView>
        <TextArea
          height={300}
          variant="unstyled"
          placeholder="What is happening?"
          onChangeText={(value) => {
            formik.setFieldValue("content", value);
          }}
          value={formik.values.content}
          fontSize="lg"
          multiline={true}
        />
      </KeyboardAwareScrollView>
      {/* <MentionsInput onChange={handleMentionChange} value={value}>
        <Mention trigger={<Text>@</Text>} data={users} renderSuggestion={({ item }) => <Text>{item.display}</Text>} />
      </MentionsInput> */}
      {mentionOpen && <MentionSelect employees={filteredEmployee} onSelect={mentionSelectHandler} />}
    </>
  );
};

export default MentionInput;
