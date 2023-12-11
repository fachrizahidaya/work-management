import dayjs from "dayjs";

import { Box, Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatTaskItem = ({
  navigation,
  name,
  date,
  owner,
  image,
  setBandAttachment,
  setBandAttachmentType,
  task,
  userId,
  roomId,
  position,
  email,
  nameUser,
  imageUser,
  type,
  active_member,
  isPinned,
  selected,
  setSelected,
}) => {
  return (
    <Box my={1}>
      <Pressable
        onPress={() => {
          setBandAttachment(task);
          setBandAttachmentType("task");
          navigation.navigate("Chat Room", {
            userId: userId,
            name: nameUser,
            roomId: roomId,
            image: imageUser,
            position: position,
            email: email,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
          });
        }}
        display="flex"
        flexDirection="row"
        alignItems="center"
        bgColor="#ffffff"
        p={5}
        borderRadius={10}
        justifyContent="space-between"
      >
        <Flex>
          <Text fontSize={14} fontWeight={400}>
            {name}
          </Text>
          <Text opacity={0.5} fontSize={12} fontWeight={300}>
            Due {dayjs(date).format("DD MMMM YYYY")}
          </Text>
        </Flex>
        <AvatarPlaceholder name={owner} image={image} size="sm" />
      </Pressable>
    </Box>
  );
};

export default ChatTaskItem;
