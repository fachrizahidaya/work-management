import React from "react";

import { SafeAreaView } from "react-native";

import CalendarWithSlider from "../../components/shared/CalendarWithSlider";
import { useFetch } from "../../hooks/useFetch";

const CalendarScreen = () => {
  const { data: projectDeadlines } = useFetch("/pm/projects/deadline");
  const { data: holidays } = useFetch("/hr/holidays/calendar");
  const { data: taskDeadlines } = useFetch("/pm/tasks/deadline");
  console.log(holidays?.data);

  const formattedProjectDeadlines = {};
  const formattedTaskDeadlines = {};
  const formattedHolidays = {};

  projectDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = { description: item.description };

    if (!formattedProjectDeadlines[key]) {
      formattedProjectDeadlines[key] = [value];
    } else {
      formattedProjectDeadlines[key].push(value);
    }
  });

  taskDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = { description: item.description };

    if (!formattedTaskDeadlines[key]) {
      formattedTaskDeadlines[key] = [value];
    } else {
      formattedTaskDeadlines[key].push(value);
    }
  });

  holidays?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = { description: item.description };

    if (!formattedHolidays[date]) {
      formattedHolidays[date] = [value];
    } else {
      formattedHolidays[date].push(value);
    }
  });

  const finalResult = { ...formattedHolidays, ...formattedProjectDeadlines, ...formattedTaskDeadlines };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarWithSlider items={finalResult} />
    </SafeAreaView>
  );
};

export default CalendarScreen;
