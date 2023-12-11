import dayjs from "dayjs";
import { Box, Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatProjectItem = ({
  navigation,
  name,
  date,
  owner,
  image,
  id,
  created_at,
  description,
  selected,
  setSelected,
  nameUser,
  imageUser,
  type,
  active_member,
  isPinned,
  email,
  project,
  userId,
  roomId,
  position,
  setBandAttachment,
  setBandAttachmentType,
}) => {
  return (
    <Box my={1}>
      <Pressable
        onPress={() => {
          setSelected(project);
          navigation.navigate("Project Detail Screen", {
            project_id: id,
            selected: selected,
            setBandAttachment: setBandAttachment,
            setBandAttachmentType: setBandAttachmentType,
            projectData: project,
            name: nameUser,
            image: imageUser,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
            email: email,
            userId: userId,
            roomId: roomId,
            position: position,
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

export default ChatProjectItem;
