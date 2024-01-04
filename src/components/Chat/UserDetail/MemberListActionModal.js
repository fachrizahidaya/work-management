import { Dimensions, Platform, Text, View } from "react-native";
import Modal from "react-native-modal";

import Button from "../../shared/Forms/Button";

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
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <Text>{memberName}</Text>
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
      </View>
    </Modal>
  );
};

export default MemberListActionModal;
