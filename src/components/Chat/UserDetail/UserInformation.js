import { TouchableOpacity, View, Text } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { ScrollView } from "react-native-gesture-handler";
import { TextProps } from "../../shared/CustomStylings";

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
  return type === "personal" ? (
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
        <Text style={[{ fontSize: 14 }, TextProps]}>Active</Text>
      </View>
    </View>
  ) : (
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
      <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>Group Participant</Text>

      <ScrollView style={{ minHeight: type === 100, maxHeight: 300 }}>
        <View gap={2}>
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
                      <Text style={[{ fontSize: 12 }, TextProps]}>
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
                        <MaterialIcons name="chevron-right" color="#3F434A" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {currentUserIsAdmin && (
              <View style={{ borderRadius: 20 }}>
                <MaterialIcons name="add" size={20} onPress={toggleMemberList} color="#3F434A" />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserInformation;
