import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import _ from "lodash";

import { SafeAreaView, StyleSheet, Text, View, Image, StatusBar, ActivityIndicator } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import AWBScannedList from "../../../components/Silo/DataEntry/AWBScannedList";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useLoading } from "../../../hooks/useLoading";

const CourierPickupScan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [courierImage, setCourierImage] = useState(null);
  const [courierName, setCourierName] = useState(null);
  const [dataScanned, setDataScanned] = useState([]);
  const [requestType, setRequestType] = useState("");
  const [filteredData, setFilteredData] = useState(dataScanned);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  const listScreenSheetRef = useRef(null);

  const { toggle: toggleScanSuccessModal, isOpen: scanSuccessModalIsOpen } = useDisclosure(false);
  const { toggle: toggleScanErrorModal, isOpen: scanErrorModalIsOpen } = useDisclosure(false);
  const { toggle: toggleScanExistedModal, isOpen: scanExistedModalIsOpen } = useDisclosure(false);

  const { isLoading: processIsLoading, toggle: toggleProcess } = useLoading(false);

  const { data: courierData } = useFetch(`/wm/courier`);

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    setData(data);
    handleAddCourierPickup(data);
  };

  const handleScanBarcodeAgain = () => {
    setTimeout(() => {
      setScanned(false);
      setData(null);
      setCourierName(null);
      setCourierImage(null);
    }, 2000);
  };

  const handleCheckCourier = (awb) => {
    const awbPrefix = awb?.slice(0, 6);

    const searchCouriers = courierData?.data?.map((courier) => {
      if (awbPrefix?.includes(courier?.prefix_code_awb)) {
        setCourierName(courier?.name);
        setCourierImage(courier?.image);
      }
      return courier;
    });

    const foundCourier = searchCouriers?.find((courier) => awbPrefix?.includes(courier?.prefix_code_awb));
    if (!foundCourier) {
      setCourierName(null);
      setCourierImage("not-found");
    }
    return searchCouriers;
  };

  const handleSearchAWB = (event) => {
    const query = event;
    setSearchQuery(query);

    const filtered = dataScanned.filter((item) => item?.toLowerCase()?.includes(query?.toLowerCase()));
    setFilteredData(filtered);
  };

  const handleAddCourierPickup = async (awb) => {
    try {
      toggleProcess();
      const res = await axiosInstance.post("/wm/courier-pickup/scan-awb", { awb_no: awb });
      if (res.data.message.includes("already")) {
        setRequestType("warning");
        toggleScanExistedModal();
      } else {
        handleCheckCourier(awb);
        setDataScanned((prevData) => [...prevData, awb]);
        setRequestType("info");
        toggleScanSuccessModal();
      }
      toggleProcess();
      handleScanBarcodeAgain();
    } catch (err) {
      console.log(err);
      setRequestType("danger");
      toggleScanErrorModal();
      toggleProcess();
      handleScanBarcodeAgain();
    }
  };

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarcodeScannerPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Courier AWB Scan" onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.wrapper}>
        {hasPermission === false ? (
          <Text>Access denied</Text>
        ) : hasPermission === null ? (
          <Text>Please grant camera access</Text>
        ) : (
          <>
            <BarCodeScanner
              style={StyleSheet.absoluteFillObject}
              onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {scanned &&
              (processIsLoading ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.content}>
                  {courierImage === "not-found" ? (
                    <Text>Not Found</Text>
                  ) : (
                    courierImage && (
                      <Image
                        style={styles.image}
                        source={{
                          uri: `${process.env.EXPO_PUBLIC_API}/image/${courierImage}`,
                        }}
                        alt="Courier Image"
                        resizeMethod="auto"
                        fadeDuration={0}
                      />
                    )
                  )}
                  <Text>{courierName && `${courierName}`}</Text>
                  <Text>{data && courierImage !== "not-found" ? `AWB: ${data}` : null}</Text>
                </View>
              ))}
            {!scanned && <View style={styles.scannerBox}></View>}
            <StatusBar style="auto" />
          </>
        )}
      </View>
      <AWBScannedList
        reference={listScreenSheetRef}
        items={dataScanned}
        filteredData={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearchAWB}
      />
      <SuccessModal
        isOpen={scanSuccessModalIsOpen}
        toggle={toggleScanSuccessModal}
        type={requestType}
        title="AWB saved!"
        description="Data has successfully updated"
      />
      <SuccessModal
        isOpen={scanErrorModalIsOpen}
        toggle={toggleScanErrorModal}
        type={requestType}
        title="Courier not found!"
        description="We cannot add the data"
      />
      <SuccessModal
        isOpen={scanExistedModalIsOpen}
        toggle={toggleScanExistedModal}
        type={requestType}
        title="AWB already scanned!"
        description="We cannot add the data"
      />
    </SafeAreaView>
  );
};

export default CourierPickupScan;

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
  scannerBox: {
    borderWidth: 2,
    width: "85%",
    height: "20%",
    borderColor: "#E8E9EB",
  },
  image: {
    height: 100,
    width: 300,
    resizeMode: "contain",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  content: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    gap: 5,
    padding: 10,
    borderRadius: 10,
  },
});
