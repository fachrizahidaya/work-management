import { Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

/**
 *
 * @param {SheetProps} props
 */
const SelectSheet = (props) => {
  return (
    <ActionSheet id={props.sheetId}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 35, display: "flex", gap: 20 }}>
        {props.payload?.children?.length > 0 &&
          props.payload.children.map((item, idx) => {
            return (
              <TouchableOpacity key={idx} onPress={() => props.payload?.onChange(item.value)}>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </ActionSheet>
  );
};

export default SelectSheet;
