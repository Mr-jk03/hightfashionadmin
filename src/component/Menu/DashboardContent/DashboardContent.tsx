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
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { desktopOS, valueFormatter } from "./webUsageStats";
import { getDataPieChar, getTotalCustomer } from "../../../config/apiFunction";
import { toast } from "react-toastify";

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalCustomer();
        setTotalCustomer(data.result);
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
                    <Typography variant="h4">{value}</Typography>
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
                  <Typography variant="h4">{value}</Typography>
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
                  <Typography variant="h4">{totalCustomer}</Typography>
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
                  <Typography variant="h4">{value}</Typography>
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
            <BarChart
              xAxis={[
                { scaleType: "band", data: ["group A", "group B", "group C"] },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              width={800}
              height={430}
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
