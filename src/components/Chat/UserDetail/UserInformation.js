import { TouchableOpacity } from "react-native";
import { Badge, Box, Divider, Flex, Icon, Text } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserInformation = ({
  type,
  selectedGroupMembers,
  loggedInUser,
  toggleMemberList,
  memberListActionIsopen,
  toggleMemberListAction,
  currentUserIsAdmin,
  memberId,
  setMemberId,
  memberName,
  setMemberName,
  memberAdminStatus,
  setMemberAdminStatus,
}) => {
  return (
    <>
      <Flex borderRadius={10} px={2} mx={3} py={2} gap={2} bg="#FFFFFF">
        <Box gap={2}>
          {type === "group" && (
            <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
              Group Participant
            </Text>
          )}
          {type === "personal" ? (
            <Text fontSize={14} fontWeight={400}>
              Active
            </Text>
          ) : (
            <Flex gap={2} flexDirection="row" flexWrap="wrap" alignItems="center">
              {selectedGroupMembers.map((member, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      currentUserIsAdmin && loggedInUser !== member?.user_id && toggleMemberListAction();
                      setMemberId(member?.id);
                      setMemberName(member?.user?.name);
                      setMemberAdminStatus(member?.is_admin);
                    }}
                  >
                    <Badge key={index} borderRadius={15}>
                      <Flex gap={2} alignItems="center" flexDirection="row">
                        <AvatarPlaceholder
                          name={!member?.user ? member?.name : member?.user?.name}
                          image={!member?.user ? member?.image : member?.user?.image}
                        />
                        {!member?.user
                          ? loggedInUser === member?.id
                            ? "You"
                            : member?.name
                          : loggedInUser === member?.user?.id
                          ? "You"
                          : member?.user?.name}
                        {member?.is_admin ? (
                          <Badge borderRadius={15} colorScheme="#186688">
                            Admin
                          </Badge>
                        ) : null}
                        {currentUserIsAdmin && loggedInUser !== member?.user_id && (
                          <Icon as={<MaterialIcons name="chevron-right" />} />
                        )}
                      </Flex>
                    </Badge>
                  </TouchableOpacity>
                );
              })}
              {currentUserIsAdmin && (
                <Badge borderRadius="full">
                  <Icon onPress={toggleMemberList} as={<MaterialIcons name={"add"} />} size={5} />
                </Badge>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default UserInformation;