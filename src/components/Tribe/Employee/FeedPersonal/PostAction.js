import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

const PostAction = ({ actionIsOpen, toggleAction, toggleDeleteModal, reference }) => {
  return (
    <ActionSheet ref={reference} onClose={toggleAction}>
      <TouchableOpacity onPress={toggleDeleteModal} style={{ ...styles.wrapper }}>
        <View>
          <Text>Delete Post</Text>
        </View>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default PostAction;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});