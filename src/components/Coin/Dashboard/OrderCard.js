import { Text, TouchableOpacity, View } from "react-native";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const OrderCard = ({ salesData }) => {
  const sales = salesData?.data?.slice(0, 5);

  return (
    <TouchableOpacity style={[card.card, { flex: 1, gap: 5 }]}>
      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 18, fontWeight: 500 }, TextProps]}>Last Orders</Text>
        <View style={{ marginVertical: 10, gap: 10 }}>
          {sales?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#f8f8f8",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <AvatarPlaceholder isThumb={false} image={null} name={item?.customer?.name} size="md" />
                  <Text style={[TextProps]}>{item?.customer?.name}</Text>
                </View>
                <Text style={[TextProps]}>{item?.so_no}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
