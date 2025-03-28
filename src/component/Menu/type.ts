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
