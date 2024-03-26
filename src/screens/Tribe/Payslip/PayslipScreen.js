import { useState, useEffect, useRef } from "react";
import _ from "lodash";

import { Linking, SafeAreaView, StyleSheet, View, Text } from "react-native";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";
import axiosInstance from "../../../config/api";
import useCheckAccess from "../../../hooks/useCheckAccess";
import PayslipPasswordEdit from "../../../components/Tribe/Payslip/PayslipPasswordEdit";
import PayslipDownload from "../../../components/Tribe/Payslip/PayslipDownload";
import { ErrorToastProps } from "../../../components/shared/CustomStylings";
import PayslipList from "../../../components/Tribe/Payslip/PayslipList";

const PayslipScreen = () => {
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [payslips, setPayslips] = useState([]);
  const [requestType, setRequestType] = useState("");

  const payslipDownloadScreenSheetRef = useRef(null);
  const payslipPasswordEditScreenSheetRef = useRef(null);

  const downloadPayslipCheckAccess = useCheckAccess("download", "Payslip");

  const { isOpen: pinUpdateModalIsOpen, toggle: togglePinUpdateModal } = useDisclosure(false);

  const fetchPayslipParameters = {
    page: currentPage,
    limit: 10,
  };

  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
  } = useFetch("/hr/payslip", [currentPage], fetchPayslipParameters);

  const fetchMorePayslip = () => {
    if (currentPage < payslip?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Handle selected payslip to download
   * @param {*} data
   */
  const openSelectedPayslip = (data) => {
    setSelectedPayslip(data);
    payslipDownloadScreenSheetRef.current?.show();
  };
  const closeSelectedPayslip = () => {
    setSelectedPayslip(null);
    payslipDownloadScreenSheetRef.current?.hide();
  };

  /**
   * Handle update Document Password update
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipPasswordUpdateHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/payslip/change-password`, data);
      console.log(res.data);
      setSubmitting(false);
      setStatus("success");
      refetchPayslip();
      togglePinUpdateModal();
      setRequestType("info");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle download payslip
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipDownloadHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.get(`/hr/payslip/${selectedPayslip}/download`, {
        params: data,
      });
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res?.data?.data}`);
      setSubmitting(false);
      setStatus("success");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  useEffect(() => {
    if (payslip?.data?.data.length) {
      setPayslips((prevData) => [...prevData, ...payslip?.data?.data]);
    }
  }, [payslip?.data]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PageHeader title="My Payslip" backButton={false} />
          <Button height={35} padding={5} onPress={() => payslipPasswordEditScreenSheetRef.current?.show()}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}>Change PIN</Text>
          </Button>
          <PayslipPasswordEdit
            reference={payslipPasswordEditScreenSheetRef}
            hideNewPassword={hideNewPassword}
            setHideNewPassword={setHideNewPassword}
            hideOldPassword={hideOldPassword}
            setHideOldPassword={setHideOldPassword}
            hideConfirmPassword={hideConfirmPassword}
            setHideConfirmPassword={setHideConfirmPassword}
            onUpdatePassword={payslipPasswordUpdateHandler}
            isOpen={pinUpdateModalIsOpen}
            toggle={togglePinUpdateModal}
            requestType={requestType}
          />
        </View>

        <PayslipList
          data={payslips}
          openSelectedPayslip={openSelectedPayslip}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
          fetchMore={fetchMorePayslip}
          isFetching={payslipIsFetching}
          refetch={refetchPayslip}
        />
      </SafeAreaView>
      <PayslipDownload
        reference={payslipDownloadScreenSheetRef}
        toggleDownloadDialog={closeSelectedPayslip}
        downloadPayslipCheckAccess={downloadPayslipCheckAccess}
        onDownloadPayslip={payslipDownloadHandler}
      />
    </>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
