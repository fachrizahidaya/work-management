import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";

import { Linking } from "react-native";
import { Actionsheet, Box, Flex, FormControl, Icon, Input, Pressable, Text, VStack, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import { useKeyboardChecker } from "../../../hooks/useKeyboardChecker";
import FormButton from "../../shared/FormButton";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../shared/ToastDialog";

const PayslipList = ({ id, month, year }) => {
  const [hidePassword, setHidePassword] = useState(true);

  const { isOpen: downloadDialogIsOpen, toggle: toggleDownloadDialog } = useDisclosure(false);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();

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
      Linking.openURL(`https://api-dev.kolabora-app.com/download/${res?.data?.data}`);
      setSubmitting(false);
      setStatus("success");
      formik.resetForm();
      toggleDownloadDialog();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={err.response.data.message} />;
        },
        placement: "top",
      });
    }
  };

  useEffect(() => {
    if (formik.isSubmitting && formik.status === "success") {
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
        <Actionsheet
          isOpen={downloadDialogIsOpen}
          onClose={() => {
            toggleDownloadDialog();
            formik.resetForm();
          }}
        >
          <Actionsheet.Content>
            <VStack
              w="95%"
              space={3}
              // pb={keyboardHeight}
            >
              <VStack w="100%" space={2}>
                <FormControl.Label justifyContent="center">Password</FormControl.Label>

                <FormControl isInvalid={formik.errors.password}>
                  <Input
                    variant="outline"
                    type={!hidePassword ? "text" : "password"}
                    placeholder="Enter your KSS password"
                    value={formik.values.password}
                    onChangeText={(value) => formik.setFieldValue("password", value)}
                    InputRightElement={
                      <Pressable onPress={() => setHidePassword(!hidePassword)}>
                        <Icon
                          as={<MaterialCommunityIcons name={hidePassword ? "eye" : "eye-off"} />}
                          size={5}
                          mr="3"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                  />
                  <FormControl.ErrorMessage>{formik.errors.password}</FormControl.ErrorMessage>
                </FormControl>
                <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
                  <Text color="white">Download</Text>
                </FormButton>
              </VStack>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>
      </Flex>
    </>
  );
};

export default PayslipList;
