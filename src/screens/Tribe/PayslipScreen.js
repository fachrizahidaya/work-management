import { useState, useCallback, useEffect } from "react";
import _ from "lodash";

import { Linking, SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import { Spinner } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { useFetch } from "../../hooks/useFetch";
import { useDisclosure } from "../../hooks/useDisclosure";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/shared/Forms/Button";
import axiosInstance from "../../config/api";
import useCheckAccess from "../../hooks/useCheckAccess";
import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import PayslipPasswordEdit from "../../components/Tribe/Payslip/PayslipPasswordEdit";
import PayslipDownload from "../../components/Tribe/Payslip/PayslipDownload";

const PayslipScreen = () => {
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [passwordDownloadError, setPasswordDownloadError] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [payslips, setPayslips] = useState([]);
  const [filteredDataArray, setFilteredDataArray] = useState([]);

  const downloadPayslipCheckAccess = useCheckAccess("download", "Payslip");

  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(false);
  const { isOpen: downloadDialogIsOpen, toggle: toggleDownloadDialog } = useDisclosure(false);

  const fetchPayslipParameters = {
    page: currentPage,
    search: searchInput,
    limit: 10,
  };

  const {
    data: payslip,
    refetch: refetchPayslip,
    isFetching: payslipIsFetching,
    isLoading: payslipIsLoading,
  } = useFetch("/hr/payslip", [currentPage, searchInput], fetchPayslipParameters);

  const fetchMorePayslip = () => {
    if (currentPage < payslip?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openSelectedPayslip = useCallback((data) => {
    toggleDownloadDialog();
    setSelectedPayslip(data);
  }, []);

  const closeSelectedPayslip = () => {
    toggleDownloadDialog();
    setSelectedPayslip(null);
  };

  /**
   * Document Password update handler
   * @param {*} data
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const payslipPasswordUpdateHandler = async (data, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.patch(`/hr/payslip/change-password`, data);
      setSubmitting(false);
      setStatus("success");
      formik.resetForm();
      refetchPayslip();

      Toast.show({
        type: "success",
        text1: "Password updated",
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      setPasswordError(err.response.data.message);

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  /**
   * Download payslip Handler
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
      setPasswordError(err.response.data.message);

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    if (payslip?.data?.data.length) {
      setPayslips((prevData) => [...prevData, ...payslip?.data?.data]);
    }
  }, [payslip?.data]);

  return (
    <>
      <SafeAreaView style={payslip?.data?.data?.length > 0 ? styles.container : styles.containerEmpty}>
        <View style={styles.header}>
          <PageHeader title="My Payslip" backButton={false} />
          <Button
            onPress={() => toggleForm()}
            padding={5}
            children={<Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}>Change PIN</Text>}
          />

          <PayslipPasswordEdit
            formIsOpen={formIsOpen}
            toggleForm={toggleForm}
            setPasswordError={setPasswordError}
            hideNewPassword={hideNewPassword}
            setHideNewPassword={setHideNewPassword}
            hideOldPassword={hideOldPassword}
            setHideOldPassword={setHideOldPassword}
            hideConfirmPassword={hideConfirmPassword}
            setHideConfirmPassword={setHideConfirmPassword}
            onUpdatePassword={payslipPasswordUpdateHandler}
          />
        </View>

        {payslip?.data?.data.length > 0 ? (
          <FlashList
            data={payslips.length ? payslips : filteredDataArray}
            keyExtractor={(item, index) => index}
            onScrollBeginDrag={() => setHasBeenScrolled(true)}
            onEndReachedThreshold={0.1}
            onEndReached={hasBeenScrolled ? fetchMorePayslip : null}
            estimatedItemSize={50}
            refreshControl={<RefreshControl refreshing={payslipIsFetching} onRefresh={refetchPayslip} />}
            ListFooterComponent={() => payslipIsLoading && hasBeenScrolled && <Spinner color="primary.600" size="lg" />}
            renderItem={({ item, index }) => (
              <PayslipList
                key={index}
                id={item?.id}
                month={item?.pay_month}
                year={item?.pay_year}
                downloadPayslipCheckAccess={downloadPayslipCheckAccess}
                onDownloadPayslip={payslipDownloadHandler}
                downloadDialogIsOpen={downloadDialogIsOpen}
                toggleDownloadDialog={toggleDownloadDialog}
                openSelectedPayslip={openSelectedPayslip}
                closeSelectedPayslip={closeSelectedPayslip}
              />
            )}
          />
        ) : payslipIsFetching ? (
          <Spinner />
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={require("./../../assets/vectors/empty.png")}
              alt="empty"
              style={{ resizeMode: "contain", height: 300, width: 300 }}
            />
            <Text>No Data</Text>
          </View>
        )}
      </SafeAreaView>
      <PayslipDownload
        downloadDialogIsOpen={downloadDialogIsOpen}
        toggleDownloadDialog={closeSelectedPayslip}
        setPasswordError={setPasswordDownloadError}
        downloadPayslipCheckAccess={downloadPayslipCheckAccess}
        onDownloadPayslip={payslipDownloadHandler}
      />
    </>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  containerEmpty: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
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
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
