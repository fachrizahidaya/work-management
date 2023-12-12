import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const UserAvatar = ({ roomId, type, name, image, position, selectedMembers = [], currentUserIsAdmin }) => {
  const navigation = useNavigation();

  return (
    <Flex pb={2} bg="#FFFFFF" alignItems="center" justifyContent="center">
      <Box>
        <AvatarPlaceholder size="2xl" name={name} image={image} isThumb={false} />
        {type === "group" && currentUserIsAdmin ? (
          <Pressable
            style={styles.editPicture}
            shadow="0"
            borderRadius="full"
            borderWidth={1}
            borderColor="#C6C9CC"
            onPress={() =>
              navigation.navigate("Edit Group", {
                type: type,
                name: name,
                image: image,
                roomId: roomId,
              })
            }
          >
            <Icon as={<MaterialCommunityIcons name="pencil" />} size={5} color="#3F434A" />
          </Pressable>
        ) : (
          <Pressable style={styles.editPicture} shadow="0" borderRadius="full">
            <Icon as={<MaterialCommunityIcons name="checkbox-blank-circle" />} size={5} color="#49C96D" />
          </Pressable>
        )}
      </Box>

      <Text fontSize={16} fontWeight={500}>
        {name?.length > 30 ? name?.split(" ")[0] : name}
      </Text>

      {type === "personal" ? (
        <Box alignItems="center">
          <Text fontSize={12} fontWeight={400}>
            {position}
          </Text>
        </Box>
      ) : null}
    </Flex>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
});
