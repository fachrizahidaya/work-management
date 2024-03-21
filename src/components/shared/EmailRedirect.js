import { Linking } from "react-native";

export const EmailRedirect = (email) => {
  try {
    const emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl);
  } catch (err) {
    console.log(err);
  }
};
