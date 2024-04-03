import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { SheetManager } from "react-native-actions-sheet";

/**
 * Handle pick an image
 */
export const pickImageHandler = async (setImage, sheetManager) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });
  if (sheetManager) {
    SheetManager.hide("form-sheet");
  }

  // Handling for name
  var filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf("/") + 1, result.assets[0].uri.length);

  const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

  if (result) {
    setImage({
      name: filename,
      size: fileInfo.size,
      type: `${result.assets[0].type}/jpg`,
      webkitRelativePath: "",
      uri: result.assets[0].uri,
    });
  }
};
