import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import { useFetch } from "../../hooks/useFetch";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import PayslipList from "../../components/Tribe/Payslip/PayslipList";
import dayjs from "dayjs";
import axiosInstance from "../../config/api";
import { useEffect } from "react";

const PayslipScreen = () => {
  const [filter, setFilter] = useState({
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  });
  const [attendance, setAttendance] = useState([]);
  const params = {
    month: dayjs().format("M"),
    year: dayjs().format("YYYY"),
  };
  const { data: payslip } = useFetch("/hr/payslip");
  const { data: listAttendance } = useFetch("/hr/timesheets/personal", [filter]);

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get("/hr/timesheets/personal", {
        params: filter,
      });
      setAttendance(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filter]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        bgColor="white"
        py={14}
        px={15}
        borderBottomWidth={1}
        borderBottomColor="#cbcbcb"
      >
        <Flex flexDir="row" gap={1}>
          <Text fontSize={16}>My Payslip</Text>
        </Flex>
        <Text fontWeight={700} fontSize={12}>
          PT Kolabora Group Indonesia
        </Text>
      </Flex>
      <FlashList
        data={payslip?.data}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <PayslipList key={item?.id} id={item?.id} month={item?.pay_month} year={item?.pay_year} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
});

export default PayslipScreen;
