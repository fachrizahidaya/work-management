import { Button, Modal } from "native-base";

const MemberListActionModal = ({
  memberListActionIsopen,
  toggleMemberListAction,
  memberId,
  memberName,
  memberAdminStatus,
  onUpdateAdminStatus = () => {},
  toggleRemoveMemberAction,
}) => {
  return (
    <Modal isOpen={memberListActionIsopen} onClose={toggleMemberListAction} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{memberName}</Modal.Header>
        <Modal.Body display="flex" gap={2}>
          {memberAdminStatus ? (
            <Button
              onPress={() => {
                onUpdateAdminStatus(memberId, 0);
                toggleMemberListAction();
              }}
              variant="outline"
            >
              Dismiss as Admin
            </Button>
          ) : (
            <Button
              onPress={() => {
                onUpdateAdminStatus(memberId, 1);
                toggleMemberListAction();
              }}
              variant="outline"
            >
              Make Group Admin
            </Button>
          )}
          <Button
            onPress={() => {
              toggleMemberListAction();
              toggleRemoveMemberAction();
            }}
            variant="outline"
          >
            Remove from Group
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default MemberListActionModal;