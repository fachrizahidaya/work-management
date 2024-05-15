import { useState } from "react";

import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

import Button from "../../shared/Forms/Button";
import { TextProps } from "../../shared/CustomStylings";

const MemberListActionModal = ({
  memberListActionIsopen,
  onToggleMemberListAction,
  memberId,
  memberName,
  memberAdminStatus,
  onUpdateAdminStatus = () => {},
  onToggleRemoveMemberAction,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal
      isVisible={memberListActionIsopen}
      onBackdropPress={() => {
        onToggleMemberListAction();
        setShowConfirmationModal(false);
      }}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      hideModalContentWhileAnimating={true}
      useNativeDriver={false}
      onModalHide={() => {
        showConfirmationModal && onToggleRemoveMemberAction();
      }}
    >
      <View style={styles.container}>
        <Text style={[{ fontSize: 12 }, TextProps]}>{memberName}</Text>
        {memberAdminStatus ? (
          <Button
            onPress={() => {
              onUpdateAdminStatus(memberId, 0);
              onToggleMemberListAction();
            }}
            variant="outline"
          >
            <Text style={[{ fontSize: 12 }, TextProps]}>Dismiss as Admin</Text>
          </Button>
        ) : (
          <Button
            onPress={() => {
              onUpdateAdminStatus(memberId, 1);
              onToggleMemberListAction();
              setShowConfirmationModal(false);
            }}
            variant="outline"
          >
            <Text style={[{ fontSize: 12 }, TextProps]}>Make Group Admin</Text>
          </Button>
        )}
        <Button
          onPress={() => {
            onToggleMemberListAction();
            setShowConfirmationModal(true);
          }}
          variant="outline"
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Remove from Group</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default MemberListActionModal;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
  },
});
