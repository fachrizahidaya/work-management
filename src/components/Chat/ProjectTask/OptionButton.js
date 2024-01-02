import { View, Text, Pressable } from "react-native";

const OptionButton = ({ tabValue, setTabValue, setSearchInput, setInputToShow }) => {
  return (
    <View
      style={{
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        marginLeft: 60,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAFA",
          padding: 5,
          marginVertical: 5,
          gap: 5,
          borderRadius: 10,
        }}
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
          style={{
            backgroundColor: tabValue === "project" ? "#E6E6E6" : null,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={() => {
            tabValue === "task" && setTabValue("project");
            setInputToShow("");
            setSearchInput("");
          }}
        >
          <Text>Project</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: tabValue === "task" ? "#E6E6E6" : null,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={() => {
            tabValue === "project" && setTabValue("task");
            setInputToShow("");
            setSearchInput("");
          }}
        >
          <Text>Ad Hoc</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OptionButton;
