import React, { useEffect } from "react";

import { SafeAreaView } from "react-native";

import CalendarWithSlider from "../../components/shared/CalendarWithSlider";
import { useFetch } from "../../hooks/useFetch";

const CalendarScreen = () => {
  const { data: projectDeadlines } = useFetch("/pm/projects/deadline");
  // const [formattedProjectDeadlines, setFormattedProjectDeadlines] = useState({});

  const formatted = Object.assign({}, projectDeadlines?.data);
  console.log(formatted);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarWithSlider />
    </SafeAreaView>
  );
};

export default CalendarScreen;
