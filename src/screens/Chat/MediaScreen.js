import { useNavigation, useRoute } from "@react-navigation/core";

import { SafeAreaView, View, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MediaList from "../../components/Chat/Media/MediaList";

const MediaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { media, docs } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-backspace" size={25} color="#3F434A" />
          </Pressable>
        </View>
      </View>
      <MediaList media={media} docs={docs} />
    </SafeAreaView>
  );
};

export default MediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
});
