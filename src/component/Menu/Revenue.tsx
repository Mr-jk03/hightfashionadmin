import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { positions, Stack, style, SxProps } from "@mui/system";
import { CurrencyDollar as CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr/CurrencyDollar";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDataLineChart } from "../../config/apiFunction";
import { handleLineChartWeek, isSameDay } from "./type";
import { isSameWeek, isSameMonth, isSameYear } from "date-fns";
import { vi } from "date-fns/locale";
import { LineChart, PieChart } from "@mui/x-charts";
import { AnchorPosition } from "@mui/x-charts/ChartsLegend/legend.types";

export interface TotalProfitProps {
  sx?: SxProps;
}

const Revenue = ({ sx }: TotalProfitProps): React.JSX.Element => {
  const [dataRvnDay, setDataRvnDay] = useState(0);
  const [dataRvnWeek, setDataRvnWeek] = useState(0);
  const [dataRvnMonth, setDataRvnMonth] = useState(0);
  const [dataRvnYear, setDataRvnYear] = useState(0);
  const [chartData, setChartData] = useState({
    x: [],
    y: [],
  });
  const [pieData, setPieData] = useState<any>([]);
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "paySuccess",
    "payFail",
  ];

  useEffect(() => {
    const dataRevenue = async () => {
      try {
        const res: any = await getDataLineChart(); // Gọi API
        if (res && res.data) {
          const revenueData = res.data; // Mảng dữ liệu doanh thu
          const now = new Date();
          setPieData(revenueData);
          const revenueDay = revenueData.filter(
            (item: any) =>
              isSameDay(new Date(item.created_at), now) &&
              item.order_status === "paySuccess"
          );
          const revenueWeek = revenueData.filter(
            (item: any) =>
              isSameWeek(new Date(item.created_at), now, {
                locale: vi,
                weekStartsOn: 1,
              }) && item.order_status === "paySuccess"
          );
          const chartValues: any = handleLineChartWeek(revenueWeek);
          setChartData(chartValues);
          const revenueMonth = revenueData.filter(
            (item: any) =>
              isSameMonth(new Date(item.created_at), now) &&
              item.order_status === "paySuccess"
          );
          const revenueYear = revenueData.filter(
            (item: any) =>
              isSameYear(new Date(item.created_at), now) &&
              item.order_status === "paySuccess"
          );

          setDataRvnDay(sumRevenue(revenueDay));
          setDataRvnWeek(sumRevenue(revenueWeek));
          setDataRvnMonth(sumRevenue(revenueMonth));
          setDataRvnYear(sumRevenue(revenueYear));
        }
      } catch (err: any) {
        toast.error("Lỗi mạng lấy dữ liệu thống kê");
      }
    };

    dataRevenue();
  }, []);
  const sumRevenue = (transactions: any[]) =>
    transactions.reduce(
      (sum, item) => sum + parseFloat(item.total_price || 0),
      0
    );

  const countMap = pieData.reduce(
    (acc: any, item: any) => {
      acc[item.order_status] = (acc[item.order_status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = pieData.length;

  const chartPieData = statuses.map((status, index) => ({
    id: index,
    value: ((countMap[status] || 0) / total) * 100,
    label: `${status} %`,
  }));

  return (
    <>
      <div className="row">
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      <span>Doanh thu/ngày</span>
                    </Typography>
                    <Typography>
                      {dataRvnDay.toLocaleString("vi-Vn", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: "#81d4fa",
                      height: "56px",
                      width: "56px",
                    }}
                  >
                    <CurrencyDollarIcon fontSize="25px" />
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      <span>Doanh thu/tuần</span>
                    </Typography>
                    <Typography>
                      {dataRvnWeek.toLocaleString("vi-Vn", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: "#26c6da",
                      height: "56px",
                      width: "56px",
                    }}
                  >
                    <CurrencyDollarIcon fontSize="25px" />
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      <span>Doanh thu/tháng</span>
                    </Typography>
                    <Typography>
                      {dataRvnMonth.toLocaleString("vi-Vn", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: "#00897b",
                      height: "56px",
                      width: "56px",
                    }}
                  >
                    <CurrencyDollarIcon fontSize="25px" />
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      <span>Doanh thu/năm</span>
                    </Typography>
                    <Typography>
                      {dataRvnYear.toLocaleString("vi-Vn", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </Stack>
                  <Avatar
                    sx={{
                      backgroundColor: "red",
                      height: "56px",
                      width: "56px",
                    }}
                  >
                    <CurrencyDollarIcon fontSize="25px" />
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-7">
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LineChart
              margin={{ left: 70, right: 20 }}
              xAxis={[{ scaleType: "point", data: chartData.x }]}
              series={[{ data: chartData.y, label: "Doanh thu tuần" }]}
              width={650}
              height={500}
            />
            <p
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Biểu đồ thống kê doanh thu theo tuần
            </p>
          </div>
        </div>
        <div className="col-5">
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[{ data: chartPieData }]}
              width={450}
              height={340}
              margin={{ bottom: 90, left: 80 }}
              legend={{
                position: { horizontal: "left", vertical: "bottom" },
                direction: "row",
                itemGap: 5,
              }}
            />
            <p
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Biểu đồ % trạng thái đơn hàng
            </p>
          </div>
        </div>
        <div className="col-12 mt-3">
          <div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Revenue;
