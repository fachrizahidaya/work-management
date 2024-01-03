import ActionSheet, { SheetProps } from "react-native-actions-sheet";

/**
 *
 * @param {SheetProps} props
 */
const FormSheet = (props) => {
  return <ActionSheet id={props.sheetId}>{props.payload?.children}</ActionSheet>;
};

export default FormSheet;
