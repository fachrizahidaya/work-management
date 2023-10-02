import { Flex, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import Schedule from "../../components/Tribe/Calendar/Schedule";
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
import axiosInstance from "../../config/api";

const CalendarScreen = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <Flex flexDir="row" gap={1}>
            <Text fontSize={16}>My Calendar</Text>
          </Flex>
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
