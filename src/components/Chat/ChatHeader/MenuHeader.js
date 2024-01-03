import { Text, StyleSheet, TouchableOpacity } from "react-native";

import ActionSheet from "react-native-actions-sheet";

const MenuHeader = ({
  fileAttachment,
  toggleSearch,
  toggleExitModal,
  toggleDeleteGroupModal,
  toggleDeleteModal,
  type,
  active_member,
  onUpdatePinHandler,
  roomId,
  isPinned,
  reference,
}) => {
  return (
    <ActionSheet ref={reference} onClose={reference.current?.hide()}>
      {/* <TouchableOpacity style={styles.wrapper}>
        <Text>Search</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin")}
        style={styles.wrapper}
      >
        <Text>{isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}</Text>
      </TouchableOpacity>
      {type === "group" ? (
        <>
          {active_member === 1 ? (
            <TouchableOpacity onPress={toggleExitModal} style={styles.wrapper}>
              <Text>Exit Group</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleDeleteGroupModal} style={styles.wrapper}>
              <Text>Delete Group</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <TouchableOpacity onPress={toggleDeleteModal} style={styles.wrapper}>
            <Text>Delete Chat</Text>
          </TouchableOpacity>
        </>
      )}
    </ActionSheet>
  );
};

export default MenuHeader;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
