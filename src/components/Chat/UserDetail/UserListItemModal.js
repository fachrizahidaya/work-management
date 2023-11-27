import { Flex, Icon, Text } from "native-base";
import { TouchableOpacity } from "react-native";

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
            if (selectedUsers.find((val) => val.id === id)) {
              onPressRemoveHandler(user);
            } else {
              onPressAddHandler(user);
            }
          }
        }}
      >
        <Flex alignItems="center" justifyContent="space-between" flexDirection="row">
          <Flex flexDirection="row" alignItems="center" my={1} gap={2}>
            <AvatarPlaceholder name={name} image={image} />

            <Flex>
              <Text fontSize={14} fontWeight={400} color="#000000">
                {name}
              </Text>
              <Text fontSize={12} fontWeight={400} opacity={0.5}>
                {userType}
              </Text>
            </Flex>
          </Flex>
          {multiSelect && (
            <Flex>
              {selectedUsers.find((val) => val.id === id) && (
                <Icon as={<MaterialCommunityIcons name="checkbox-marked" />} size="md" color="primary.600" />
              )}
            </Flex>
          )}
        </Flex>
      </TouchableOpacity>
    )
  );
};

export default UserListItemModal;
