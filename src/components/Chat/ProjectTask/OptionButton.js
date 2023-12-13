import { Flex, Pressable, Text } from "native-base";

const OptionButton = ({ tabValue, setTabValue, setSearchInput, setInputToShow }) => {
  return (
    <Flex ml={60} flexDir="row" background="#ffffff" flex={0} justifyContent="center" alignItems="center">
      <Flex
        bgColor="#fafafa"
        gap={3}
        borderRadius={10}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        p={2}
        my={2}
      >
        <Pressable
          p={2}
          borderRadius={10}
          bgColor={tabValue === "project" ? "#E6E6E6" : null}
          onPress={() => {
            tabValue === "task" && setTabValue("project");
            setInputToShow("");
            setSearchInput("");
          }}
        >
          <Text>Project</Text>
        </Pressable>
        <Pressable
          p={2}
          borderRadius={10}
          bgColor={tabValue === "task" ? "#E6E6E6" : null}
          onPress={() => {
            tabValue === "project" && setTabValue("task");
            setInputToShow("");
            setSearchInput("");
          }}
        >
          <Text>Ad Hoc</Text>
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default OptionButton;
