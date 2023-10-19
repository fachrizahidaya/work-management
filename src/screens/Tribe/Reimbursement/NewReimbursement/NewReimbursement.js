import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";

import { Dimensions } from "react-native";
import { Box, Text } from "native-base";

import PageHeader from "../../../../components/shared/PageHeader";
import NewReimbursementForm from "../../../../components/Tribe/Reimbursement/NewReimbursementForm";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";

const NewReimbursement = ({ route }) => {
  const { width, height } = Dimensions.get("window");

  const { onClose } = route.params;

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

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="#FFFFFF" p={3}>
        <PageHeader
          title="New Reimbursement"
          onPress={
            formik.values.title || formik.values.description || formik.values.total || formik.values.date
              ? toggleReturnModal
              : () => navigation.navigate("Feed")
          }
        />

        <ReturnConfirmationModal
          isOpen={returnModalIsOpen}
          toggle={toggleReturnModal}
          onPress={() => {
            toggleReturnModal();
            navigation.navigate("Feed");
          }}
          description="If you return, It will be discarded"
        />

        <NewReimbursementForm formik={formik} />
      </Box>
    </Box>
  );
};

export default NewReimbursement;
