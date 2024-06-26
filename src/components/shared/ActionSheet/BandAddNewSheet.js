import { useNavigation } from "@react-navigation/native";

import ActionSheet from "react-native-actions-sheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { TextProps } from "../CustomStylings";

const BandAddNewSheet = (props) => {
  const navigation = useNavigation();
  const createProjectAccess = useCheckAccess("create", "Projects");
  const createTaskAccess = useCheckAccess("create", "Tasks");
  const createNoteAccess = useCheckAccess("create", "Notes");

  const items = [
    {
      icons: "view-grid-outline",
      title: `New Project ${createProjectAccess ? "" : "(No access)"}`,
      screen: createProjectAccess ? "Project Form" : "Dashboard",
    },
    {
      icons: "plus",
      title: `New Task | ad hoc ${createTaskAccess ? "" : "(No access)"}`,
      screen: createTaskAccess ? "Task Form" : "Dashboard",
    },
    {
      icons: "pencil-outline",
      title: `New Notes ${createNoteAccess ? "" : "(No access)"}`,
      screen: createNoteAccess ? "Note Form" : "Dashboard",
    },
  ];
  return (
    <ActionSheet ref={props.reference}>
      <View style={styles.container}>
        {items.map((item, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              style={styles.wrapper}
              onPress={() => {
                navigation.navigate(item.screen, {
                  projectData: null,
                  taskData: null,
                  noteData: null,
                });
                props.reference.current?.hide();
              }}
            >
              <View style={styles.flex}>
                <View style={styles.item}>
                  <MaterialCommunityIcons name={item.icons} size={20} color="#3F434A" />
                </View>
                <Text key={item.title} style={TextProps}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ActionSheet>
  );
};

export default BandAddNewSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 21,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
