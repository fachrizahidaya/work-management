import { Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ScrollView } from "react-native-actions-sheet";
import { TextProps } from "../CustomStylings";

const SelectSheet = ({ reference, children, onChange }) => {
  return (
    <ActionSheet ref={reference}>
      <ScrollView style={{ maxHeight: 400, marginBottom: 40 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, display: "flex", gap: 20 }}>
          {children?.length > 0 &&
            children.map((item, idx) => {
              return (
                <TouchableOpacity key={idx} onPress={() => onChange(item.value)}>
                  <Text style={TextProps}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default SelectSheet;
