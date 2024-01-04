import { TouchableOpacity, View, Text } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { ScrollView } from "react-native-gesture-handler";

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
    <ScrollView>
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
        {type === "group" && (
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#b8a9a3" }}>Group Participant</Text>
        )}

        <View gap={2}>
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
                    <View style={{ borderRadius: 15, backgroundColor: "#ededed", padding: 5 }} key={index}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <AvatarPlaceholder
                          name={!member?.user ? member?.name : member?.user?.name}
                          image={!member?.user ? member?.image : member?.user?.image}
                          size="xs"
                        />
                        <Text style={{ fontSize: 12 }}>
                          {!member?.user
                            ? loggedInUser === member?.id
                              ? "You"
                              : member?.name
                            : loggedInUser === member?.user?.id
                            ? "You"
                            : member?.user?.name}
                        </Text>
                        {member?.is_admin ? (
                          <View style={{ borderRadius: 10, padding: 5, backgroundColor: "#186688" }}>
                            <Text style={{ fontSize: 12, color: "#FFFFFF" }}>Admin</Text>
                          </View>
                        ) : null}
                        {currentUserIsAdmin && loggedInUser !== member?.user_id && (
                          <MaterialIcons name="chevron-right" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {currentUserIsAdmin && (
                <View style={{ borderRadius: 20 }}>
                  <MaterialIcons name="add" size={20} onPress={toggleMemberList} />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default UserInformation;
