import { TouchableOpacity, View, Text } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserListItemModal = ({
  id,
  name,
  user,
  userType,
  image,
  multiSelect,
  type,
  onPressAddHandler,
  onPressRemoveHandler,
  userSelector,
  selectedUsers,
  setSelectedUsers,
}) => {
  return (
    userSelector.id !== id && (
      <TouchableOpacity
        onPress={() => {
          if (multiSelect) {
            if (selectedUsers?.find((val) => val.id === id)) {
              onPressRemoveHandler(user);
            } else {
              onPressAddHandler(user);
            }
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5, gap: 5 }}>
            <AvatarPlaceholder name={name} image={image} />

            <View>
              <Text style={{ fontSize: 14, fontWeight: "400", color: "#000000" }}>{name}</Text>
              <Text style={{ fontSize: 12, fontWeight: "400", opacity: 0.5 }}>{userType}</Text>
            </View>
          </View>
          {multiSelect && (
            <View>
              {selectedUsers?.find((val) => val.id === id) && (
                <MaterialCommunityIcons name="checkbox-marked" size={20} color="#176688" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  );
};

export default UserListItemModal;
