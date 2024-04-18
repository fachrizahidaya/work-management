import { View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";

const ChatCalendar = ({ reference, colorDots }) => {
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
        />
      </View>
    </ActionSheet>
  );
};

export default ChatCalendar;
