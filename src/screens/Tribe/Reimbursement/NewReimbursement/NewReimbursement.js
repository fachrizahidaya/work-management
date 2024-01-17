import { useState } from "react";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";

import { Dimensions, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";

import PageHeader from "../../../../components/shared/PageHeader";
import NewReimbursementForm from "../../../../components/Tribe/Reimbursement/NewReimbursementForm";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { ErrorToastProps } from "../../../../components/shared/CustomStylings";

const NewReimbursement = () => {
  const [fileAttachment, setFileAttachment] = useState(null);
  const { width, height } = Dimensions.get("window");

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const navigation = useNavigation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      description: "",
      total: "",
      date: "",
    },
  });

  /**
   * Select file handler
   */
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

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
          Toast.show("Max file size is 3MB", ErrorToastProps);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <View style={{ ...styles.container, width: width, height: height }}>
        <PageHeader
          title="New Reimbursement"
          onPress={
            formik.values.title || formik.values.description || formik.values.total || formik.values.date
              ? toggleReturnModal
              : () => navigation.navigate("Dashboard")
          }
        />

        <ReturnConfirmationModal
          isOpen={returnModalIsOpen}
          toggle={toggleReturnModal}
          onPress={() => {
            toggleReturnModal();
            navigation.navigate("Dashboard");
          }}
          description="If you return, It will be discarded"
        />

        <NewReimbursementForm formik={formik} onSelectFile={selectFile} fileAttachment={fileAttachment} />
      </View>
    </View>
  );
};

export default NewReimbursement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
});
