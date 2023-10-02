import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import dayjs from "dayjs";

import Schedule from "../../components/Tribe/Calendar/Schedule";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../config/api";
import PageHeader from "../../components/shared/PageHeader";

const CalendarScreen = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <PageHeader title="My Calendar" backButton={false} />
        </Flex>
        <Schedule />
      </SafeAreaView>
    </>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
  },
});
