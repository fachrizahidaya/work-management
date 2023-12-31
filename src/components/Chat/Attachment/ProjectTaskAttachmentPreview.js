import { View, Text, Pressable, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProjectTaskAttachmentPreview = ({ bandAttachment, setBandAttachment, bandAttachmentType }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text>{bandAttachment?.title}</Text>
        <Pressable onPress={() => setBandAttachment(null)}>
          <MaterialCommunityIcons name="close" size={20} />
        </Pressable>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: 100 }}>
        {bandAttachmentType === "project" ? (
          <>
            <MaterialCommunityIcons name="lightning-bolt" size={100} color="#595f69" />
            <Text>{bandAttachment?.title}</Text>
            <Text>#{bandAttachment?.project_no}</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={100} color="#595f69" />
            <Text>{bandAttachment?.title}</Text>
            <Text>#{bandAttachment?.task_no}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default ProjectTaskAttachmentPreview;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
