import ActionSheet, { SheetProps } from "react-native-actions-sheet";

import { Text } from "react-native";

/**
 *
 * @param {SheetProps} props
 */
const ExampleSheet = (props) => {
  return (
    <ActionSheet id={props.sheetId}>
      <Text>Hello world</Text>
    </ActionSheet>
  );
};

export default ExampleSheet;
