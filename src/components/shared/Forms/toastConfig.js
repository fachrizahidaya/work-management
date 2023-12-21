import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => <BaseToast {...props} style={{ borderLeftColor: "#49c86c" }} />,
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => <ErrorToast {...props} style={{ borderLeftColor: "#FD7972" }} />,
};
