import React, { useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { FlashList } from "@shopify/flash-list";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReturnConfirmationModal from "../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useFetch } from "../../../hooks/useFetch";
import KPIDetailList from "../../../components/Tribe/Performance/KPIDetailList";
import KPIDetailItem from "../../../components/Tribe/Performance/KPIDetailItem";
import PageHeader from "../../../components/shared/PageHeader";

const AppraisalScreen = () => {
  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const { data: appraisalList } = useFetch(`/hr/performance-appraisal/${id}`);
  console.log(appraisalList);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee Appraisal" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <KPIDetailList
          dayjs={dayjs}
          begin_date={appraisalList?.data?.begin_date}
          end_date={appraisalList?.data?.end_date}
          name={appraisalList?.data?.description}
          position={appraisalList?.data?.target_level}
        />

        <View style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <FlashList
              data={appraisalList?.data?.value}
              estimatedItemSize={50}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <KPIDetailItem
                  description={item?.description}
                  question={item?.measurement}
                  target={item?.target}
                  navigation={navigation}
                  reference={formScreenSheetRef}
                  threshold={item?.threshold}
                  weight={item?.weight}
                  type="appraisal"
                />
              )}
            />
          </View>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
      />
    </>
  );
};

export default AppraisalScreen;

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
