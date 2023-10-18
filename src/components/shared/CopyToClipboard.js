import { Clipboard } from "react-native";

export const CopyToClipboard = (text) => {
  try {
    if (typeof text !== String) {
      var textToCopy = text.toString();
      Clipboard.setString(textToCopy);
    } else {
      Clipboard.setString(text);
    }
  } catch (err) {
    console.log(err);
  }
};
