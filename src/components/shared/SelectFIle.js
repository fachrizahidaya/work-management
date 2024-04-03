import * as DocumentPicker from "expo-document-picker";
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-root-toast";
import { ErrorToastProps } from "./CustomStylings";

/**
 * Handle select file
 */
export const selectFile = async (setFileAttachment, sheetManager) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });
    if (sheetManager) {
      SheetManager.hide("form-sheet");
    }

    // Check if there is selected file
    if (result) {
      if (result.assets[0].size < 3000001) {
        setFileAttachment({
          name: result.assets[0].name,
          size: result.assets[0].size,
          type: result.assets[0].mimeType,
          uri: result.assets[0].uri,
          webkitRelativePath: "",
        });
      } else {
        Alert.alert("Max file size is 3MB");
      }
    }
  } catch (err) {
    console.log(err);
    Toast.show(err.response.data.message, ErrorToastProps);
  }
};
