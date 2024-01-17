import { View, Text, Pressable } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const OptionButton = ({ tabValue, setTabValue, setSearchInput, setInputToShow, setProjects, setTasks }) => {
  const changeBandType = () => {
    if (tabValue === "project") {
      setTabValue("task");
      setTasks([]);
    } else {
      setTabValue("project");
      setProjects([]);
    }
    setInputToShow("");
    setSearchInput("");
  };

  return (
    <View
      style={{
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        marginLeft: 90,
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
      >
        <Pressable
          style={{
            backgroundColor: tabValue === "project" ? "#E6E6E6" : null,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={changeBandType}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Project</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: tabValue === "task" ? "#E6E6E6" : null,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={changeBandType}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Ad Hoc</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OptionButton;
