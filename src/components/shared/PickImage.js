import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Dimensions, Platform, Text, View } from "react-native";
import Modal from "react-native-modal";
import { SheetManager } from "react-native-actions-sheet";

import Button from "./Forms/Button";
import { TextProps } from "./CustomStylings";

/**
 * Handle pick an image
 */
export const pickImageHandler = async (useCamera, setImage, sheetManager) => {
  let result;

  if (useCamera) {
    await ImagePicker.requestCameraPermissionsAsync();
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (sheetManager) {
      SheetManager.hide("form-sheet");
    }
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

const PickImage = ({ setImage, sheetManager, modalIsOpen, toggleModal }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  /**
   * Handle pick an image
   */
  const pickImageHandler = async (useCamera, setImage) => {
    let result;

    if (useCamera) {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });
      toggleModal();
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });
      toggleModal();
    }
    if (sheetManager) {
      SheetManager.hide("form-sheet");
    }

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

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

  return (
    <Modal isVisible={modalIsOpen} onBackdropPress={toggleModal} deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
      <View style={{ backgroundColor: "#FFFFFF", padding: 10, borderRadius: 10, gap: 5 }}>
        <Button variant="outline" onPress={() => pickImageHandler(false, setImage)}>
          <Text style={[TextProps]}>Add from Galery</Text>
        </Button>
        <Button variant="outline" onPress={() => pickImageHandler(true, setImage)}>
          <Text style={[TextProps]}>Take an image</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default PickImage;
