import { useState } from "react";
import dayjs from "dayjs";

import { Box, Flex, Pressable, Text } from "native-base";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatTaskItem = ({ name, date, owner, image, task, setSelected }) => {
  const [color, setColor] = useState(false);
  const [taskId, setTaskId] = useState();
  return (
    <Box my={1}>
      <Pressable
        onPress={() => {
          if (!color && task?.id !== taskId) {
            setColor(true);
            setSelected(task);
            setTaskId(task?.id);
          } else {
            setColor(false);
            setSelected(null);
            setTaskId(null);
          }
        }}
        display="flex"
        flexDirection="row"
        alignItems="center"
        bgColor={color ? "#f1f1f1" : "#ffffff"}
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
