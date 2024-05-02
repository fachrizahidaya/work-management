import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { ErrorToastProps } from "../../../components/shared/CustomStylings";
import Button from "../../../components/shared/Forms/Button";
import Tabs from "../../../components/shared/Tabs";
import NewSupplierProfileForm from "../../../components/Coin/Supplier/NewSupplierProfileForm";
import NewSupplierAddressForm from "../../../components/Coin/Supplier/NewSupplierAddressForm";
import NewSupplierSubmission from "../../../components/Coin/Supplier/NewSupplierSubmission";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import NewSupplierBankDetailForm from "../../../components/Coin/Supplier/NewSupplierBankDetailForm";

const NewSupplierScreen = () => {
  const [tabValue, setTabValue] = useState("Profile");
  const [bankList, setBankList] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const { setRequestType, toggleSuccessModal } = route.params;

  const { data: category } = useFetch(`/acc/supplier-category`);
  const { data: top } = useFetch(`/acc/terms-payment`);
  const { data: currencies } = useFetch(`/acc/currency`);
  const { data: bank } = useFetch(`/acc/bank`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);
  const { isOpen: submissionModalIsOpen, toggle: toggleSubmissionModal } = useDisclosure(false);

  const supplierCategory = category?.data?.map((item, index) => ({
    label: item?.name,
    value: item?.id,
  }));

  const bankOption = bank?.data.map((item, index) => ({
    label: item?.name,
    value: item?.id,
  }));

  const termOfPayment = top?.data.map((item, index) => ({
    label: item?.name,
    value: item?.id,
  }));

  const currency = currencies?.data.map((item, index) => ({
    label: item?.name,
    value: item?.id,
  }));

  const tabs = useMemo(() => {
    return [
      { title: `Profile`, value: "Profile" },
      { title: `Address`, value: "Address" },
      { title: `Bank Detail`, value: "Bank Detail" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const exitNewSupplier = () => {
    toggleReturnModal();
    navigation.goBack();
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      phone: "",
      supplier_category_id: "",
      address: "",
      city: "",
      province: "",
      state: "",
      address: "",
      zip_code: "",
      currency_id: "",
      terms_payment_id: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email().required("Email is required"),
      phone: yup.string().matches(phoneRegExp, "Phone number is invalid").required("Phone Number is required"),
      address: yup.string().required("Address is required"),
      city: yup.string().required("City is required"),
      province: yup.string().required("Province is required"),
      state: yup.string().required("State is required"),
      zip_code: yup
        .string()
        .min(5, "ZIP Code consists 5 numbers")
        .max(5, "ZIP Code only 5 numbers")
        .required("ZIP Code is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      addSupplierHandler(values, setSubmitting, setStatus);
    },
  });

  const bankFormik = useFormik({
    initialValues: {
      bank_id: "",
      account_no: "",
      account_name: "",
    },
    validationSchema: yup.object().shape({
      account_no: yup.string().matches(phoneRegExp, "Account number is invalid").required("Account Number is required"),
      account_name: yup.string().required("Account Name is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setBankList((prevState) => [...prevState, values]);
      resetForm();
    },
  });

  const addSupplierHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/acc/supplier`, {
        supplier: form,
        supplier_bank: bankList,
      });
      setSubmitting(false);
      setStatus("success");
      setRequestType("post");
      toggleSubmissionModal();
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  const formValueEmpty =
    !formik.values.address &&
    !formik.values.name &&
    !formik.values.email &&
    !formik.values.supplier_category_id &&
    !formik.values.phone &&
    !formik.values.city &&
    !formik.values.province &&
    !formik.values.state &&
    !formik.values.zip_code;

  const allFormFilled =
    formik.values.address &&
    formik.values.name &&
    formik.values.email &&
    formik.values.supplier_category_id &&
    formik.values.phone &&
    formik.values.city &&
    formik.values.province &&
    formik.values.state &&
    formik.values.zip_code?.length === 5;

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader
          title="New Supplier"
          onPress={() => {
            formValueEmpty ? navigation.goBack() : toggleReturnModal();
          }}
        />
        <Button height={35} padding={10} disabled={allFormFilled ? false : true} onPress={toggleSubmissionModal}>
          <Text style={[{ color: "#FFFFFF", fontSize: 12, fontWeight: "500" }]}>Submit</Text>
        </Button>
      </View>
      <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <ScrollView>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 14,
            gap: 20,
          }}
        >
          {tabValue === "Profile" ? (
            <>
              <NewSupplierProfileForm
                supplierCategory={supplierCategory}
                formik={formik}
                termsOfPayment={termOfPayment}
                currency={currency}
              />
            </>
          ) : tabValue === "Address" ? (
            <>
              <NewSupplierAddressForm formik={formik} />
            </>
          ) : (
            <>
              <NewSupplierBankDetailForm formik={bankFormik} bank={bankOption} />
            </>
          )}
        </View>
      </ScrollView>
      <NewSupplierSubmission
        formik={formik}
        visible={submissionModalIsOpen}
        backdropPress={toggleSubmissionModal}
        isSubmitting={formik.isSubmitting}
        onSubmit={formik.handleSubmit}
        toggleOtherModal={toggleSuccessModal}
        bankFormik={bankFormik}
      />
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        onPress={exitNewSupplier}
        description="Are you sure want to return? It will be deleted."
      />
    </SafeAreaView>
  );
};

export default NewSupplierScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  header: {
    gap: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#C6C9CC",
    shadowOffset: 0,
  },
});
