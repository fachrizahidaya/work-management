import { View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

/**
 *
 * @param {SheetProps} props
 */
const SelectSheet = (props) => {
  return (
    <ActionSheet id={props.sheetId}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 35, display: "flex", gap: 20 }}>
        {props.payload?.children}
      </View>
    </ActionSheet>
  );
};

export default SelectSheet;
