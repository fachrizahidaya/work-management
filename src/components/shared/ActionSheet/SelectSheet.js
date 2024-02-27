import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ScrollView } from "react-native-actions-sheet";
import { TextProps } from "../CustomStylings";

const SelectSheet = ({ reference, children, onChange }) => {
  return (
    <ActionSheet ref={reference}>
      <ScrollView style={{ maxHeight: 400, marginBottom: 40 }}>
        <View style={styles.menu}>
          <View style={styles.wrapper}>
            {children?.length > 0 &&
              children.map((item, idx) => {
                return (
                  <TouchableOpacity key={idx} onPress={() => onChange(item.value)} style={styles.menuItem}>
                    <Text style={[TextProps, { fontSize: 16 }]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  menu: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  wrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});

export default SelectSheet;
