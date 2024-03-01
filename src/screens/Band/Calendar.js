import React, { useState } from "react";
import dayjs from "dayjs";

import { SafeAreaView } from "react-native";

import CalendarWithSlider from "../../components/shared/CalendarWithSlider";
import { useFetch } from "../../hooks/useFetch";

const CalendarScreen = () => {
  const [filter, setFilter] = useState({
    year: dayjs().format("YYYY"),
  });

  const leaveFetchParameters = filter;

  const { data: projectDeadlines } = useFetch("/pm/projects/deadline");
  const { data: holidays } = useFetch("/hr/holidays/calendar");
  const { data: taskDeadlines } = useFetch("/pm/tasks/deadline");
  const { data: leaves } = useFetch(
    "/hr/timesheets/personal",
    [filter],
    leaveFetchParameters
  );

  const today = dayjs().format("DD-MM-YYYY");

  const filteredLeave = leaves?.data.filter(
    (item) => item?.att_type === "Leave"
  );

  const formattedProjectDeadlines = {};
  const formattedTaskDeadlines = {};
  const formattedHolidays = {};
  const formattedLeaves = {};

  const formattedDotColorProjects = {};
  const formattedDotColorTasks = {};
  const formattedDotColorHolidays = {};
  const formattedDotColorToday = {};
  const formattedDotColorLeaves = {};

  projectDeadlines?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = {
      description: item.description,
      id: item.id,
      module: item.module,
      dotColor: "#49c96d",
    };

    if (!formattedProjectDeadlines[key]) {
      formattedProjectDeadlines[key] = [value];
    } else {
      formattedProjectDeadlines[key].push(value);
    }
  });

  projectDeadlines?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#49c96d",
          borderRadius: 5,
        },
        text: {
          color: "#ffffff",
        },
      },
    };

    formattedDotColorProjects[key] = value;
  });

  taskDeadlines?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = {
      description: item.description,
      id: item.id,
      module: item.module,
      dotColor: "#49c96d",
    };

    if (!formattedTaskDeadlines[key]) {
      formattedTaskDeadlines[key] = [value];
    } else {
      formattedTaskDeadlines[key].push(value);
    }
  });

  taskDeadlines?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const key = `${date.slice(0, 7)}-01`; // Truncate to the first day of the month
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#49c96d",
          borderRadius: 5,
        },
        text: {
          color: "#FFFFFF",
        },
      },
    };

    formattedDotColorTasks[key] = value;
  });

  holidays?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = { description: item.description, dotColor: "#4688D5" };

    if (!formattedHolidays[date]) {
      formattedHolidays[date] = [value];
    } else {
      formattedHolidays[date].push(value);
    }
  });

  holidays?.data?.forEach((item) => {
    const date = item.date.split("-").reverse().join("-"); // Convert date format
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#4688D5",
          borderRadius: 5,
        },
        text: {
          color: "#FFFFFF",
        },
      },
    };

    formattedDotColorHolidays[date] = value;
  });

  filteredLeave?.forEach((item) => {
    const date = item.date;
    const value = { description: item.att_type, dotColor: "#4688D5" };

    if (!formattedLeaves[date]) {
      formattedLeaves[date] = [value];
    } else {
      formattedLeaves[date].push(value);
    }
  });

  filteredLeave?.forEach((item) => {
    const date = item.date;
    const value = {
      customStyles: {
        container: {
          backgroundColor: "#4688D5",
          borderRadius: 5,
        },
        text: {
          color: "#FFFFFF",
        },
      },
    };
    formattedDotColorLeaves[date] = value;
  });

  const date = today.split("-").reverse().join("-");
  const value = {
    customStyles: {
      container: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderRadius: 5,
      },
      text: {
        color: "#186688",
      },
    },
  };

  formattedDotColorToday[date] = value;

  const finalResult = {
    ...formattedProjectDeadlines,
    ...formattedTaskDeadlines,
    ...formattedHolidays,
    ...formattedLeaves,
  };

  const colorDots = {
    ...formattedDotColorProjects,
    ...formattedDotColorTasks,
    ...formattedDotColorHolidays,
    ...formattedDotColorToday,
    ...formattedDotColorLeaves,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarWithSlider items={finalResult} colorDots={colorDots} />
    </SafeAreaView>
  );
};

export default CalendarScreen;
