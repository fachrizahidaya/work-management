import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";

import { Box, Flex, Icon, Pressable, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import PayslipDownload from "./PayslipDownload";

const PayslipList = ({ month, year, downloadPayslipCheckAccess, onDownloadPayslip }) => {
  const [passwordError, setPasswordError] = useState("");

  const { isOpen: downloadDialogIsOpen, toggle: toggleDownloadDialog } = useDisclosure(false);

  /**
   * Input Password Handler
   */
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: yup.object().shape({
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      onDownloadPayslip(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      toggleDownloadDialog();
      formik.resetForm();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <>
      <Flex
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderTopColor="#E8E9EB"
        borderTopWidth={1}
        py={3}
        px={4}
      >
        <Box>
          <Text fontWeight={500} fontSize={14} color="#3F434A">
            {dayjs()
              .month(month - 1)
              .year(year)
              .format("MMMM YYYY")}
          </Text>
        </Box>

        <Pressable onPress={toggleDownloadDialog}>
          <Icon as={<MaterialCommunityIcons name="tray-arrow-down" />} size={6} color="#186688" />
        </Pressable>
        <PayslipDownload
          downloadDialogIsOpen={downloadDialogIsOpen}
          formik={formik}
          toggleDownloadDialog={toggleDownloadDialog}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          downloadPayslipCheckAccess={downloadPayslipCheckAccess}
        />
      </Flex>
    </>
  );
};

export default PayslipList;
