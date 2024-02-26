import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { TextProps } from "../../../shared/CustomStylings";

const PostAction = ({ toggleAction, toggleDeleteModal, reference }) => {
  return (
    <>
      <ActionSheet ref={reference} onClose={toggleAction}>
        <TouchableOpacity
          onPress={toggleDeleteModal}
          style={{ ...styles.wrapper }}
        >
          <View>
            <Text style={[{ fontSize: 16 }, TextProps]}>Delete Post</Text>
          </View>
        </TouchableOpacity>
      </ActionSheet>
    </>
  );
};

export default PostAction;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
