import { View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

/**
 *
 * @param {SheetProps} props
 */
const FormSheet = (props) => {
  return (
    <ActionSheet id={props.sheetId}>
      <View style={{ paddingBottom: 40 }}>{props.payload?.children}</View>
    </ActionSheet>
  );
};

export default FormSheet;
