import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";

import { Linking } from "react-native";
import { Box, Flex, Icon, Pressable, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import PayslipDownload from "./PayslipDownload";
import { ErrorToast } from "../../shared/ToastDialog";

const PayslipList = ({ id, month, year, downloadPayslipCheckAccess }) => {
  const [passwordError, setPasswordError] = useState("");

  const { isOpen: downloadDialogIsOpen, toggle: toggleDownloadDialog } = useDisclosure(false);

  const toast = useToast();

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
      payslipDownloadHandler(values, setSubmitting, setStatus);
    },
  });

  /**
   * Payslip Download Handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipDownloadHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.get(`/hr/payslip/${id}/download`, {
        params: data,
      });
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res?.data?.data}`);
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setPasswordError(err.response.data.message);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Download failed, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  };

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
