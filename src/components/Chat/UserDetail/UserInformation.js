import { TouchableOpacity, View, Text } from "react-native";
import { Badge } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserInformation = ({
  type,
  selectedGroupMembers,
  loggedInUser,
  toggleMemberList,
  toggleMemberListAction,
  currentUserIsAdmin,
  setMemberId,
  setMemberName,
  setMemberAdminStatus,
}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 10,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 5,
        }}
      >
        <View gap={2}>
          {type === "group" && (
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#b8a9a3" }}>Group Participant</Text>
          )}
          {type === "personal" ? (
            <Text style={{ fontSize: 14, fontWeight: "400" }}>Active</Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5 }}>
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
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
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
                          <MaterialIcons name="chevron-right" />
                        )}
                      </View>
                    </Badge>
                  </TouchableOpacity>
                );
              })}
              {currentUserIsAdmin && (
                <Badge borderRadius="full">
                  <MaterialIcons name="add" size={10} onPress={toggleMemberList} />
                </Badge>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default UserInformation;
