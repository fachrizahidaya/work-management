import React from "react";

import { SafeAreaView } from "react-native";

import CalendarWithSlider from "../../components/shared/CalendarWithSlider";
import { useFetch } from "../../hooks/useFetch";

const CalendarScreen = () => {
  const { data: projectDeadlines } = useFetch("/pm/projects/deadline");
  const { data: holidays } = useFetch("/hr/holidays/calendar");
  const { data: taskDeadlines } = useFetch("/pm/tasks/deadline");

  const formattedProjectDeadlines = {};
  const formattedTaskDeadlines = {};
  const formattedHolidays = {};

  const formattedDotColorProjects = {};
  const formattedDotColorTasks = {};
  const formattedDotColorHolidays = {};

  projectDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = { description: item.description, id: item.id, module: item.module, dotColor: "black" };

    if (!formattedProjectDeadlines[key]) {
      formattedProjectDeadlines[key] = [value];
    } else {
      formattedProjectDeadlines[key].push(value);
    }
  });

  projectDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#daecfc",
          borderRadius: 5,
        },
      },
    };

    formattedDotColorProjects[date] = value;
  });

  taskDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = { description: item.description, id: item.id, module: item.module, dotColor: "black" };

    if (!formattedTaskDeadlines[key]) {
      formattedTaskDeadlines[key] = [value];
    } else {
      formattedTaskDeadlines[key].push(value);
    }
  });

  taskDeadlines?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#daecfc",
          borderRadius: 5,
        },
      },
    };

    formattedDotColorTasks[date] = value;
  });

  holidays?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = { description: item.description, dotColor: "#3bc14a" };

    if (!formattedHolidays[date]) {
      formattedHolidays[date] = [value];
    } else {
      formattedHolidays[date].push(value);
    }
  });

  holidays?.data.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#3bc14a",
          borderRadius: 5,
        },
      },
    };

    formattedDotColorHolidays[date] = value;
  });

  const finalResult = { ...formattedHolidays, ...formattedProjectDeadlines, ...formattedTaskDeadlines };

  const colorDots = { ...formattedDotColorProjects, ...formattedDotColorTasks, ...formattedDotColorHolidays };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarWithSlider items={finalResult} colorDots={colorDots} />
    </SafeAreaView>
  );
};

export default CalendarScreen;
