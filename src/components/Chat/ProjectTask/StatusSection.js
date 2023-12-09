import { Flex, Pressable, Text } from "native-base";

const StatusSection = ({ open, onProgress, finish }) => {
  return (
    <Pressable
      display="flex"
      flexDir="row"
      alignItems="center"
      bgColor="#ffffff"
      py={3}
      px={5}
      borderRadius={10}
      justifyContent="space-between"
      gap={3}
      flex={1}
    >
      <Flex alignItems="center">
        <Text color="#FF965D" fontSize={12} fontWeight={500}>
          {open}
        </Text>
        <Text fontSize={12} fontWeight={400}>
          Open
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Text color="#304FFD" fontSize={12} fontWeight={500}>
          {onProgress}
        </Text>
        <Text fontSize={12} fontWeight={400}>
          On Progress
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Text color="#FFD240" fontSize={12} fontWeight={500}>
          {finish}
        </Text>
        <Text fontSize={12} fontWeight={400}>
          Finish
        </Text>
      </Flex>
    </Pressable>
  );
};

export default StatusSection;
