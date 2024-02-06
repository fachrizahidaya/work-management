import { useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useLoading } from "../../../../hooks/useLoading";
import ReviewDetailList from "../../../../components/Tribe/Performance/ReviewList/ReviewDetailList";
import ReviewDetailItem from "../../../../components/Tribe/Performance/ReviewList/ReviewDetailItem";

const ReviewScreen = () => {
  const [question, setQuestion] = useState(null);
  const [kpiValues, setKpiValues] = useState([]);
  const [employeeKpiValue, setEmployeeKpiValue] = useState([]);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee KPI" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity
          // onPress={() => {
          //   submitHandler();
          //   navigation.goBack();
          // }}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        {/* <ReviewDetailList
      dayjs={dayjs}
      begin_date={kpiList?.data?.performance_kpi?.review?.begin_date}
      end_date={kpiList?.data?.performance_kpi?.review?.end_date}
      position={kpiList?.data?.performance_kpi?.target_level}
      target={kpiList?.data?.performance_kpi?.target_name}
      targetLevel={kpiList?.data?.performance_kpi?.target_level}
    /> */}

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {/* {kpiValues &&
          kpiValues.length > 0 &&
          kpiValues.map((item, index) => {
            return (
              <ReviewDetailItem
                key={index}
                id={
                  item?.employee_kpi_value_id
                  // ? item?.employee_kpi_value_id
                  // : item?.id
                }
                description={item?.description}
                target={item?.target}
                type="kpi"
                weight={item?.weight}
                threshold={item?.threshold}
                measurement={item?.measurement}
                actual={item?.actual_achievement === null ? 0 : item?.actual_achievement}
                onChange={employeeKpiValueUpdateHandler}
              />
            );
          })} */}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
    </>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
