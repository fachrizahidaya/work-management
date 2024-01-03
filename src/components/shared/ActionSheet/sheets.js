import { registerSheet } from "react-native-actions-sheet";
import FormSheet from "./FormSheet";
import SelectSheet from "./SelectSheet";

registerSheet("form-sheet", FormSheet);
registerSheet("select-sheet", SelectSheet);

export {};
