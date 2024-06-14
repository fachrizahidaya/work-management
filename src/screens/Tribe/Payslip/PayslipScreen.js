import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";

import { Linking, SafeAreaView, StyleSheet, View, Text } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";
import axiosInstance from "../../../config/api";
import useCheckAccess from "../../../hooks/useCheckAccess";
import PayslipPasswordEdit from "../../../components/Tribe/Payslip/PayslipPasswordEdit";
import PayslipDownload from "../../../components/Tribe/Payslip/PayslipDownload";
import PayslipList from "../../../components/Tribe/Payslip/PayslipList";
import CardSkeleton from "../../../components/Coin/shared/CardSkeleton";

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
  const firstTimeRef = useRef(null);

  const downloadPayslipCheckAccess = useCheckAccess("download", "Payslip");

  const { isOpen: pinUpdateModalIsOpen, toggle: togglePinUpdateModal } = useDisclosure(false);
  const { isOpen: errorUpdateModalIsOpen, toggle: toggleErrorUpdateModal } = useDisclosure(false);
  const { isOpen: errorDownloadModalIsOpen, toggle: toggleErrorDownloadModal } = useDisclosure(false);

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
      toggleErrorUpdateModal();
      setRequestType("danger");
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
      toggleErrorDownloadModal();
      setRequestType("danger");
    }
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<CardSkeleton key={i} />);
    }
    return skeletons;
  };

  useEffect(() => {
    if (payslip?.data?.data.length) {
      setPayslips((prevData) => [...prevData, ...payslip?.data?.data]);
    }
  }, [payslip?.data]);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetchPayslip();
    }, [refetchPayslip])
  );

  return (
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
          successModalIsOpen={pinUpdateModalIsOpen}
          toggleSuccessModal={togglePinUpdateModal}
          requestType={requestType}
          errorModalIsOpen={errorUpdateModalIsOpen}
          toggleErrorModal={toggleErrorUpdateModal}
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
        renderSkeletons={renderSkeletons}
      />
      <PayslipDownload
        reference={payslipDownloadScreenSheetRef}
        toggleDownloadDialog={closeSelectedPayslip}
        onDownloadPayslip={payslipDownloadHandler}
        errorModalIsOpen={errorDownloadModalIsOpen}
        toggleErrorModal={toggleErrorDownloadModal}
        requestType={requestType}
      />
    </SafeAreaView>
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
