import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { TextProps } from "../../../components/shared/CustomStylings";
import IncomeCard from "../../../components/Coin/Dashboard/IncomeCard";
import SalesAndCustomerCard from "../../../components/Coin/Dashboard/SalesAndCustomerCard";
import { useFetch } from "../../../hooks/useFetch";
import AnalyticCard from "../../../components/Coin/Dashboard/AnalyticCard";
import StatisticCard from "../../../components/Coin/Dashboard/StatisticCard";
import SalesCard from "../../../components/Coin/Dashboard/SalesCard";
import OrderCard from "../../../components/Coin/Dashboard/OrderCard";

const CoinDashboard = () => {
  const {
    data: customerData,
    isLoading: customerDataIsLoading,
    refetch: refetchCustomerData,
    isFetching: customerDataIsFetching,
  } = useFetch(`/acc/customer`);

  const {
    data: invoiceData,
    isLoading: invoiceDataIsLoading,
    refetch: refetchInvoiceData,
    isFetching: invoiceDataIsFetching,
  } = useFetch(`/acc/sales-invoice`);

  const {
    data: salesData,
    isLoading: salesDataIsLoading,
    refetch: refetchSalesData,
    isFetching: salesDataIsFetching,
  } = useFetch(`/acc/sales-order`);

  const { data: purchaseData } = useFetch(`/acc/po`);

  const currencyConverter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const invoiceAmount = invoiceData?.data?.map((item) => item?.subtotal_amount);
  const salesAmount = salesData?.data?.map((item) => item?.subtotal_amount);

  const sumOfInvoice = invoiceAmount?.reduce(totalSum);
  const sumOfSales = salesAmount?.reduce(totalSum);

  const salesByMonth = invoiceData?.data?.map((item) => ({
    amount: item?.subtotal_amount,
    date: dayjs(item?.invoice_date).format("MMM YY"),
  }));

  const purchaseByMonth = purchaseData?.data?.map((item) => ({
    amount: item?.subtotal_amount,
    date: dayjs(item?.po_date).format("MMM YY"),
  }));

  function totalSum(total, value) {
    return total + value;
  }

  /**
   * For Income Card
   */
  const currentMonth = dayjs().format("M");

  const incomeBySingleMonth = invoiceData?.data?.map((item) => ({
    amount: item?.subtotal_amount,
    date: dayjs(item?.so_date).format("M"),
  }));

  const currentMonthIncome = incomeBySingleMonth?.filter((item) => item?.date === currentMonth.toString());
  const previousMonthIncome = incomeBySingleMonth?.filter((item) => item?.date === (currentMonth - 1).toString());

  const totalCurrentMonthIncome = currentMonthIncome?.reduce((sum, item) => sum + (item?.amount || 0), 0);
  const totalPreviousMonthIncome = previousMonthIncome?.reduce((sum, item) => sum + (item?.amount || 0), 0);

  const incomePercentageOfChangeBetweenPreviousAndCurrentMonth =
    ((totalCurrentMonthIncome - totalPreviousMonthIncome) / totalCurrentMonthIncome) * 100;

  /**************************************************************** */

  /**
   * For Sales and Customer Card
   */
  const salesBySingleMonth = invoiceData?.data?.map((item) => ({
    amount: item?.subtotal_amount,
    date: dayjs(item?.invoice_date).format("M"),
  }));

  const currentMonthSales = salesBySingleMonth?.filter((item) => item?.date === currentMonth.toString());
  const previousMonthSales = salesBySingleMonth?.filter((item) => item?.date === (currentMonth - 1).toString());

  const totalCurrentMonthSales = currentMonthSales?.reduce((sum, item) => sum + (item?.amount || 0), 0);
  const totalPreviousMonthSales = previousMonthSales?.reduce((sum, item) => sum + (item?.amount || 0), 0);

  const salesPercentageOfChangeBetweenPreviousAndCurrentMonth =
    ((totalCurrentMonthSales - totalPreviousMonthSales) / totalPreviousMonthSales) * 100;

  const filteredCustomerByCurrentMonth = customerData?.data?.filter(
    (item) => dayjs(item?.created_at).format("M") == dayjs().format("M")
  );

  const filteredCustomerByPreviousMonth = customerData?.data?.filter(
    (item) => dayjs(item?.created_at).format("M") == dayjs().format("M") - 1
  );

  const customerTotalPercentageOfChangeBetweenPreviousAndCurrentMonth =
    ((filteredCustomerByCurrentMonth?.length - filteredCustomerByPreviousMonth?.length) / customerData?.data?.length) *
    100;

  /**************************************************************** */

  /**
   * For Statistic Card
   */
  let sumSalesByMonth = {};
  let sumPurchaseByMonth = {};

  salesByMonth?.forEach((item) => {
    if (sumSalesByMonth[item?.date]) {
      sumSalesByMonth[item?.date] += item?.amount;
    } else {
      sumSalesByMonth[item?.date] = item?.amount;
    }
  });

  purchaseByMonth?.forEach((item) => {
    if (sumPurchaseByMonth[item?.date]) {
      sumPurchaseByMonth[item?.date] += item?.amount;
    } else {
      sumPurchaseByMonth[item?.date] = item?.amount;
    }
  });

  const sumByMonth = {};
  let count = 0;

  for (const monthYear in sumSalesByMonth) {
    if (count >= 6) break;
    if (!sumByMonth[monthYear]) {
      sumByMonth[monthYear] = [sumSalesByMonth[monthYear], 0];
    } else {
      sumByMonth[monthYear][0] = sumSalesByMonth[monthYear];
    }
    count++; // Increment the counter
  }

  for (const monthYear in sumPurchaseByMonth) {
    if (count >= 6) break; // If 5 entries processed, break out of the loop
    if (!sumByMonth[monthYear]) {
      sumByMonth[monthYear] = [0, sumPurchaseByMonth[monthYear]];
    } else {
      sumByMonth[monthYear][1] = sumPurchaseByMonth[monthYear];
    }
    count++; // Increment the counter
  }
  /**************************************************************** */

  /**
   * For Sales Card
   */
  const currentYear = dayjs().format("YYYY");

  const salesByYear = invoiceData?.data.map((item) => ({
    amount: item?.subtotal_amount,
    date: dayjs(item?.invoice_date).format("YYYY"),
  }));

  const currentYearSales = salesByYear?.filter((item) => item?.date === currentYear.toString());
  const previousYearSales = salesByYear?.filter((item) => item?.date === (currentYear - 1).toString());

  const totalCurrentYearSales = currentYearSales?.reduce((sum, item) => sum + (item?.amount || 0), 0);
  const totalPreviousYearSales = previousYearSales?.reduce((sum, item) => sum + (item?.amount || 0), 0);

  /**************************************************************** */

  const refetchEverything = () => {
    refetchCustomerData();
    refetchInvoiceData();
    refetchSalesData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#176688" }}>Financial</Text>
        </View>
        <Text style={[{ fontWeight: 700 }, TextProps]}>PT Kolabora Group Indonesia</Text>
      </View>

      <ScrollView
        style={{ paddingHorizontal: 14 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={customerDataIsFetching && invoiceDataIsFetching && salesDataIsFetching}
            onRefresh={refetchEverything}
          />
        }
      >
        <View style={styles.wrapper}>
          <IncomeCard
            total_income={sumOfSales || 0}
            salesIsLoading={salesDataIsLoading}
            currencyConverter={currencyConverter}
            monthlyIncomePercentage={incomePercentageOfChangeBetweenPreviousAndCurrentMonth}
          />
          <SalesAndCustomerCard
            customer_qty={customerData?.data?.length || 0}
            customerIsLoading={customerDataIsLoading}
            total_sales={sumOfInvoice || 0}
            invoiceIsLoading={invoiceDataIsLoading}
            currencyConverter={currencyConverter}
            monthlySalesPercentage={salesPercentageOfChangeBetweenPreviousAndCurrentMonth}
            monthlyCustomerPercentage={customerTotalPercentageOfChangeBetweenPreviousAndCurrentMonth}
          />
          <StatisticCard sumByMonth={sumByMonth} />
          <AnalyticCard sumByMonth={sumByMonth} />
          <SalesCard
            sumOfSales={sumOfInvoice || 0}
            currencyConverter={currencyConverter}
            currentYearSales={totalCurrentYearSales}
            previousYearSales={totalPreviousYearSales}
          />
          <OrderCard salesData={salesData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoinDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  wrapper: {
    flex: 1,
    gap: 14,
    marginVertical: 14,
  },
});
