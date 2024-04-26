import { useCallback } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import { TextProps } from "../../shared/CustomStylings";

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
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: 150 }}>
          {allLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.container}>
              {projectDeadlines?.length > 0 || taskDeadlines?.length > 0 ? (
                <>
                  {projectDeadlines?.map((item, index) => {
                    return (
                      <View key={index} style={styles.content}>
                        <View style={{ alignItems: "center", gap: 3 }}>
                          <Text style={[TextProps]}>
                            {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("DD")}
                          </Text>
                          <Text style={[TextProps]}>
                            {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("ddd")}
                          </Text>
                        </View>
                        <View style={styles.wrapper}>
                          <Text style={[TextProps]}>{item?.description}</Text>
                        </View>
                      </View>
                    );
                  })}
                  {taskDeadlines?.map((item, index) => {
                    return (
                      <View key={index} style={styles.content}>
                        <View style={{ alignItems: "center", gap: 3 }}>
                          <Text style={[TextProps]}>
                            {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("DD")}
                          </Text>
                          <Text style={[TextProps]}>
                            {dayjs(`${item?.date.split("-").reverse().join("-").slice(0, 7)}-01`).format("ddd")}
                          </Text>
                        </View>
                        <View style={styles.wrapper}>
                          <Text style={[TextProps]}>{item?.description}</Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}
              {holidays?.length > 0 ? (
                <>
                  {holidays?.map((item, index) => {
                    return (
                      <View key={index} style={styles.content}>
                        <View style={{ alignItems: "center", gap: 3 }}>
                          <Text style={[TextProps]}>
                            {dayjs(item?.date.split("-").reverse().join("-")).format("DD")}
                          </Text>
                          <Text style={[TextProps]}>
                            {dayjs(item?.date.split("-").reverse().join("-")).format("ddd")}
                          </Text>
                        </View>
                        <View style={styles.wrapper}>
                          <Text style={[TextProps]}>{item?.description}</Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}
              {leaves?.length > 0 ? (
                <>
                  {leaves?.map((item, index) => {
                    return (
                      <View key={index} style={styles.content}>
                        <View style={{ alignItems: "center", gap: 3 }}>
                          <Text style={[TextProps]}>{dayjs(item?.date).format("DD")}</Text>
                          <Text style={[TextProps]}>{dayjs(item?.date).format("ddd")}</Text>
                        </View>
                        <View style={styles.wrapper}>
                          <Text style={[TextProps]}>{item?.att_reason}</Text>
                        </View>
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

const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 8,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 10,
    flex: 1,
  },
});
