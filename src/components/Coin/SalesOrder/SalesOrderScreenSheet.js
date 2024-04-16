import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const SalesOrderScreenSheet = ({ id, onDownload, isLoading }) => {
  const optionsArr = [
    {
      name: "Download",
      icon: !isLoading ? "tray-arrow-down" : <ActivityIndicator />,
      iconColor: "#176688",
      onPress: async () => {
        await SheetManager.hide("form-sheet");
        onDownload(id);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        {optionsArr.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={item.onPress} style={styles.content}>
              <Text style={[{ fontSize: 16 }, TextProps]}>{item.name}</Text>
              <MaterialCommunityIcons name={item.icon} size={20} color="#176688" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SalesOrderScreenSheet;

const styles = StyleSheet.create({
  container: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
});
