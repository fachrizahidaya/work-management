import dayjs from "dayjs";

import { Box, Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatTaskItem = ({
  id,
  navigation,
  name,
  date,
  owner,
  image,
  setBandAttachment,
  setBandAttachmentType,
  userId,
  roomId,
  imageUser,
  position,
  email,
  nameUser,
  type,
  active_member,
  isPinned,
  item,
}) => {
  return (
    <Box my={1}>
      <Pressable
        onPress={() => {
          navigation.navigate("Task Detail Screen", {
            task_id: id,
            setBandAttachment: setBandAttachment,
            setBandAttachmentType: setBandAttachmentType,
            userId: userId,
            roomId: roomId,
            name: nameUser,
            image: imageUser,
            position: position,
            email: email,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
            taskData: item,
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
