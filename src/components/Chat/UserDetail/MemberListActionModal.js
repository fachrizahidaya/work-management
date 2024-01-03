// import { Button, Modal } from "native-base";
import { Dimensions, Platform, Text } from "react-native";
import Button from "../../shared/Forms/Button";
import Modal from "react-native-modal";

const MemberListActionModal = ({
  memberListActionIsopen,
  toggleMemberListAction,
  memberId,
  memberName,
  memberAdminStatus,
  onUpdateAdminStatus = () => {},
  toggleRemoveMemberAction,
}) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal
      isVisible={memberListActionIsopen}
      onBackdropPress={toggleMemberListAction}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      {/* <Modal.Content>
        <Modal.CloseButton /> */}
      {/* <Modal.Header>{memberName}</Modal.Header> */}
      {/* <Modal.Body display="flex" gap={2}> */}
      {memberAdminStatus ? (
        <Button
          onPress={() => {
            onUpdateAdminStatus(memberId, 0);
            toggleMemberListAction();
          }}
          variant="outline"
        >
          <Text>Dismiss as Admin</Text>
        </Button>
      ) : (
        <Button
          onPress={() => {
            onUpdateAdminStatus(memberId, 1);
            toggleMemberListAction();
          }}
          variant="outline"
        >
          <Text>Make Group Admin</Text>
        </Button>
      )}
      <Button
        onPress={() => {
          toggleMemberListAction();
          toggleRemoveMemberAction();
        }}
        variant="outline"
      >
        <Text>Remove from Group</Text>
      </Button>
      {/* </Modal.Body> */}
      {/* </Modal.Content> */}
    </Modal>
  );
};

export default MemberListActionModal;
