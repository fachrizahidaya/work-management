import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";
import { useFetch } from "../../../hooks/useFetch";
import Toast from "react-native-root-toast";
import { ErrorToastProps, SuccessToastProps } from "../../../components/shared/CustomStylings";
import axiosInstance from "../../../config/api";

const CourierPickupScan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [courierImage, setCourierImage] = useState(null);
  const [courierName, setCourierName] = useState(null);

  const navigation = useNavigation();

  const { data: courierData } = useFetch(`/wm/courier`);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    handleCheckCourier(data);
    handleAddCourierPickup(data);
  };

  const handleScanBarcodeAgain = () => {
    setScanned(false);
    setData(null);
    setCourierName(null);
    setCourierImage(null);
  };

  const handleCheckCourier = (awb) => {
    const awbPrefix = awb?.slice(0, 3);
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

  const handleAddCourierPickup = async (awb) => {
    try {
      const res = await axiosInstance.post("/wm/courier-pickup/scan-awb", {
        awb_no: awb,
      });
      if (res.data.message.includes("already")) {
        Toast.show(res.data.message, ErrorToastProps);
      } else {
        Toast.show(res.data.message, SuccessToastProps);
      }
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
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
        <PageHeader title="Data Scan" onPress={() => navigation.goBack()} />
      </View>

      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        {courierImage === "not-found" ? (
          <Text>Not Found</Text>
        ) : courierImage === null ? null : (
          <Image
            style={styles.image}
            source={{
              uri: `${process.env.EXPO_PUBLIC_API}/image/${courierImage}`,
            }}
            alt="Courier Image"
            resizeMethod="auto"
            fadeDuration={0}
          />
        )}

        <Text>{courierName ? `${courierName}` : ""}</Text>
        <Text>{data && courierImage !== "not-found" ? `AWB: ${data}` : ""}</Text>
        {hasPermission === false ? (
          <Text>Access denied</Text>
        ) : hasPermission === null ? (
          <Text>Please grant camera access</Text>
        ) : (
          <BarCodeScanner style={styles.scanner} onBarCodeScanned={scanned ? undefined : handleBarcodeScanned} />
        )}
        {scanned && (
          <Button padding={10} onPress={() => handleScanBarcodeAgain()}>
            <Text style={{ color: "#FFFFFF" }}>Tap to Scan again</Text>
          </Button>
        )}
      </View>
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
  scanner: {
    height: "65%",
    width: "100%",
  },
  image: {
    height: 100,
    width: 200,
    resizeMode: "contain",
  },
});
