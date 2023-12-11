import { Flex, Text } from "native-base";

const MentionSelectItem = ({ image, name, username, onSelect }) => {
  return (
    <Flex>
      <Text onPress={() => onSelect(username)}>{name}</Text>
    </Flex>
  );
};

export default MentionSelectItem;
