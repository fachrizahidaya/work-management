import { Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const SalesCard = ({ sumOfSales, currencyConverter, currentYearSales, previousYearSales }) => {
  const data = [
    { value: previousYearSales, color: "#FF965D" }, // Last Year
    { value: currentYearSales, color: "#377893" }, // Current Year
  ];

  return (
    <TouchableOpacity style={[card.card, { flex: 1, gap: 5 }]}>
      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 18, fontWeight: 500 }, TextProps]}>Sales</Text>
        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <PieChart
            innerCircleBorderWidth={1}
            donut
            innerRadius={50}
            radius={90}
            data={data}
            centerLabelComponent={() => {
              return <Text style={[TextProps]}>{currencyConverter.format(sumOfSales)}</Text>;
            }}
          />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={[TextProps, { textAlign: "left" }]}>Curr. Year</Text>
          <Text style={[TextProps]}>{currencyConverter.format(currentYearSales)}</Text>
          <Text style={[TextProps, { textAlign: "right" }]}>{`${((currentYearSales / sumOfSales) * 100).toFixed(
            0
          )}%`}</Text>
        </View>
        <View style={{ borderWidth: 0.8, borderColor: "#E8E9EB" }} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={[TextProps, { textAlign: "left" }]}>Last Year</Text>
          <Text style={[TextProps]}>{currencyConverter.format(previousYearSales)}</Text>
          <Text style={[TextProps, { textAlign: "right" }]}>
            {`${((previousYearSales / sumOfSales) * 100).toFixed(0)}%`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SalesCard;
