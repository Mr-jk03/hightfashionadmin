import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Receipt as ReceiptIcon } from "@phosphor-icons/react/dist/ssr/Receipt";
import { CurrencyDollar as CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr/CurrencyDollar";
import PersonIcon from "@mui/icons-material/Person";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  getDataLineChart,
  getDataPieChar,
  getTotalCustomer,
} from "../../../config/apiFunction";
import { toast } from "react-toastify";
import { LineChart } from "@mui/x-charts";
import moment from "moment";

export interface TotalProfitProps {
  sx?: SxProps;
  value: string;
}

const DashboardContent = ({
  value,
  sx,
}: TotalProfitProps): React.JSX.Element => {
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [dataPieChart, setDataPieChart] = useState<any>([]);
  const [dataPaySuccess, setDataPaySuccess] = useState<any>([]);
  const [revenue, setRevenue] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [chartData, setChartData] = useState<{ x: string[]; y: number[] }>({
    x: [],
    y: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalCustomer();
        if (data) {
          setTotalCustomer(data.result);
        } else {
          toast.error("Lỗi APi lấy tổng số khách hàng!");
        }

        const dataPie = await getDataPieChar();
        if (dataPie) {
          const format = dataPie?.data.map((o: any) => ({
            label: o.category_name,
            value: o.angle,
          }));

          setDataPieChart(format);
        } else {
          toast.error("Lỗi dữ liệu danh mục!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy tổng số khách hàng");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const generateData = async () => {
      try {
        const res: any = await getDataLineChart();
        if (res && res.data) {
          const orders = res.data;

          const paidOrders = orders.filter(
            (order: any) => order.order_status === "paySuccess"
          );
          const totalPaid: any = paidOrders.reduce(
            (sum: number, order: any) => sum + parseFloat(order.total_price),
            0
          );
          setRevenue(totalPaid);
          setTotalOrder(paidOrders.length);
          const dailyTotal: Record<string, number> = {};
          paidOrders.forEach((order: any) => {
            const date = moment(order.created_at).format("YYYY-MM-DD");
            const totalPrice = parseFloat(order.total_price);

            if (!dailyTotal[date]) {
              dailyTotal[date] = 0;
            }
            dailyTotal[date] += totalPrice;
          });
          const daysInMonth = moment().daysInMonth();
          const currentMonth = moment().format("YYYY-MM");

          const xAxisData: string[] = [];
          const yAxisData: number[] = [];

          for (let i = 1; i <= daysInMonth; i++) {
            const date = `${currentMonth}-${String(i).padStart(2, "0")}`;
            xAxisData.push(date);
            yAxisData.push(dailyTotal[date] || 0);
          }

          setChartData({ x: xAxisData, y: yAxisData });
        }
      } catch (err: any) {
        toast.error("Lỗi lấy dữ liệu biểu đồ");
      }
    };

    generateData();
  }, []);

  return (
    <div>
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
                      tổng doanh thu
                    </Typography>
                    <Typography>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {revenue.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
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
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
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
                    Tổng Số đơn
                  </Typography>
                  <Typography>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {totalOrder} đơn
                    </span>
                  </Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "#ffa200",
                    height: "56px",
                    width: "56px",
                  }}
                >
                  <ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
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
                    tổng khách hàng
                  </Typography>
                  <Typography>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {totalCustomer}
                    </span>
                  </Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "green",
                    height: "56px",
                    width: "56px",
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <div className="col-3">
          <Card sx={sx}>
            <CardContent>
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
                    kho
                  </Typography>
                  <Typography>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                      abc
                    </span>
                  </Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "var(--mui-palette-primary-main)",
                    height: "56px",
                    width: "56px",
                  }}
                >
                  <WarehouseIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-8">
          <div className="box-chart">
            <LineChart
              margin={{ left: 70, right: 20 }}
              xAxis={[{ scaleType: "point", data: chartData.x }]}
              series={[{ data: chartData.y, label: "Doanh số" }]}
              width={750}
              height={500}
            />
          </div>
        </div>
        <div className="col-4">
          <div className="box-chart">
            <PieChart
              series={[
                {
                  data: dataPieChart,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -45,
                  endAngle: 225,
                  cx: 70,
                  cy: 250,
                },
              ]}
              height={500}
              slotProps={{
                legend: {},
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
