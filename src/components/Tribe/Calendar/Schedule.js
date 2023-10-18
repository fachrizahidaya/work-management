import React, { useState, Component, useEffect } from "react";

import dayjs from "dayjs";

import CalendarWithSlider from "../../shared/CalendarWithSlider";

const Schedule = ({}) => {
  const [items, setItems] = useState({});
  const selectedDate = dayjs().format("YYYY-MM-DD");

  return (
    <>
      <CalendarWithSlider selectedDate={"2023-10-02"} />
    </>
  );
};

export default Schedule;
