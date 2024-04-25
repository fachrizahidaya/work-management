import { useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ChatCalendar = ({
  reference,
  colorDots,
  holidays,
  leaves,
  projectDeadlines,
  taskDeadlines,
  dayjs,
  setFilter,
  allLoading,
}) => {
  /**
   *  Handle switch month on calendar
   */
  const switchMonthHandler = useCallback((newMonth) => {
    setFilter(newMonth);
  }, []);

  /**
   * Handle switch month on calendar
   * @param {*} newMonth
   */
  const monthChangeHandler = useCallback((newMonth) => {
    switchMonthHandler(newMonth);
  }, []);

  return (
    <ActionSheet ref={reference}>
      <View style={{ gap: 21, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 }}>
        <Calendar
          markingType="custom"
          markedDates={colorDots}
          theme={{
            arrowColor: "black",
            "stylesheet.calendar.header": {
              dayTextAtIndex0: { color: "#FF7272" },
              dayTextAtIndex6: { color: "#FF7272" },
            },
          }}
          onMonthChange={monthChangeHandler}
        />
        <ScrollView style={{ height: 150 }}>
          {allLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={{ gap: 5 }}>
              {projectDeadlines?.length > 0 || taskDeadlines?.length > 0 ? (
                <>
                  {projectDeadlines?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          backgroundColor: "#f8f8f8",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <MaterialCommunityIcons name="square-rounded" color="#3DD04B" />
                        <Text>
                          {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("DD MMM")}:
                        </Text>
                        <Text>{item?.description}</Text>
                      </View>
                    );
                  })}
                  {taskDeadlines?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          backgroundColor: "#f8f8f8",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <MaterialCommunityIcons name="square-rounded" color="#3DD04B" />
                        <Text>
                          {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("DD MMM")}:
                        </Text>
                        <Text>{item?.description}</Text>
                      </View>
                    );
                  })}
                </>
              ) : null}
              {holidays?.length > 0 ? (
                <>
                  {holidays?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          backgroundColor: "#f8f8f8",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <MaterialCommunityIcons name="square-rounded" color="#3DD04B" />
                        <Text>{dayjs(item?.date.split("-").reverse().join("-")).format("DD MMM")}:</Text>
                        <Text>{item?.description}</Text>
                      </View>
                    );
                  })}
                </>
              ) : null}
              {leaves?.length > 0 ? (
                <>
                  {leaves?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          backgroundColor: "#f8f8f8",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <MaterialCommunityIcons name="square-rounded" color="#4688D5" />
                        <Text>{dayjs(item?.date).format("DD MMM")}:</Text>
                        <Text>{item?.att_reason}</Text>
                      </View>
                    );
                  })}
                </>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

export default ChatCalendar;
