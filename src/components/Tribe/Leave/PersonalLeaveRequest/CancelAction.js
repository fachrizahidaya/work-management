import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

const CancelAction = ({ onDeselect, toggleCancelModal, reference }) => {
  return (
    <ActionSheet ref={reference} onClose={onDeselect}>
      <TouchableOpacity onPress={toggleCancelModal} style={{ ...styles.wrapper }}>
        <View>
          <Text>Cancel Request</Text>
        </View>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default CancelAction;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
