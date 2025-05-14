import { Theme, useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function getStyles(
  name: string,
  personName: readonly string[],
  theme: Theme
) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export const colors = [
  "Đỏ",
  "Xanh dương",
  "Xanh lá",
  "Vàng",
  "Cam",
  "Tím",
  "Hồng",
  "Nâu",
  "Đen",
  "Trắng",
  "Xám",
  "Lục lam",
  "Đỏ tươi",
  "Lục nhạt",
  "Nâu đỏ",
  "Xanh nước biển",
  "Ô liu",
  "Xanh mòng két",
  "Bạc",
  "Vàng kim",
  "Be",
  "Xanh ngọc",
  "Tím than",
  "Chàm",
  "San hô",
];

export const sizes = ["s", "m", "l", "xl", "xxl", "freeSize"];

export const isSameDay = (date1: Date, date2: Date) =>
  date1.toLocaleDateString() === date2.toLocaleDateString();

export const handleLineChartWeek = (data: any[]) => {
  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const salesData: Record<string, number> = daysOfWeek.reduce(
    (acc, day) => {
      acc[day] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  data.forEach((item) => {
    const day = new Date(item.created_at).getDay();
    const dayName = daysOfWeek[day === 0 ? 6 : day - 1];
    const price = parseFloat(item.total_price) || 0;
    salesData[dayName] += price;
  });

  return {
    x: daysOfWeek,
    y: daysOfWeek.map((day) => salesData[day]),
  };
};

export const handleLineChartDay = (data: any[]) => {
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i.toString()); // ["0", "1", ..., "23"]
  const salesData: Record<string, number> = hoursOfDay.reduce(
    (acc, hour) => {
      acc[hour] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  data.forEach((item) => {
    const hour = new Date(item.created_at).getHours();
    const price = parseFloat(item.total_price) || 0;
    salesData[hour.toString()] += price;
  });

  return {
    x: hoursOfDay,
    y: hoursOfDay.map((hour) => salesData[hour]),
  };
};

export const handleLineChartMonth = (data: any[]) => {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const salesData: Record<string, number> = daysInMonth.reduce(
    (acc, day) => {
      acc[day] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  data.forEach((item) => {
    const day = new Date(item.created_at).getDate();
    const price = parseFloat(item.total_price) || 0;
    salesData[day.toString()] += price;
  });

  return {
    x: daysInMonth,
    y: daysInMonth.map((day) => salesData[day]),
  };
};

export const handleLineChartYear = (data: any[]) => {
  const monthsOfYear = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const salesData: Record<string, number> = monthsOfYear.reduce(
    (acc, month) => {
      acc[month] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  data.forEach((item) => {
    const month = new Date(item.created_at).getMonth() + 1;
    const price = parseFloat(item.total_price) || 0;
    salesData[month.toString()] += price;
  });

  return {
    x: monthsOfYear,
    y: monthsOfYear.map((month) => salesData[month]),
  };
};

export interface TotalPriceStatusOrder {
  all: number;
  pending: number;
  payed: number;
  shipper: number;
  success: number;
}

export const initPriceStatusOrder: TotalPriceStatusOrder = {
  all: 0,
  pending: 0,
  payed: 0,
  shipper: 0,
  success: 0,
};
