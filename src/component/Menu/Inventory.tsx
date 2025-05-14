import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { colors, getStyles, MenuProps, sizes } from "./type";
import ArchiveIcon from "@mui/icons-material/Archive";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { ColumnInventory } from "../../ColumnTable/ColumnInventory";
import {
  addPrdToStock,
  deletePrdInStock,
  getListInventory,
  GetListProducts,
} from "../../config/apiFunction";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import moment from "moment";

const Inventory = () => {
  const theme = useTheme();
  const [refresh, setRefresh] = useState(false);
  const [colorName, setColorName] = React.useState<string[]>([]);
  const [size, setSize] = React.useState<string[]>([]);
  const [dataTable, setDataTable] = useState([]);
  const [dateofentry, setDateOfEnTry] = useState("");
  const [brandName, setBrandName] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [stock_quantity, setStock_quantity] = useState(0);
  const [importPrice, setImportPrice] = useState(0);
  const [total_price, setTotal_price] = useState(0);
  const [unit, setUnit] = useState("");
  const [note, setNote] = useState("");
  const [productId, setProductId] = useState("");
  const [selectProductId, setSelectProductId] = useState([]);
  const handleChangeSelectChip = (
    event: SelectChangeEvent<typeof colorName>
  ) => {
    const {
      target: { value },
    } = event;
    setColorName(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeSelectSizeChip = (
    event: SelectChangeEvent<typeof colorName>
  ) => {
    const {
      target: { value },
    } = event;
    setSize(typeof value === "string" ? value.split(",") : value);
  };
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  useEffect(() => {
    if (stock_quantity && importPrice) {
      const totalPrice = Number(stock_quantity) * Number(importPrice);
      setTotal_price(totalPrice);
    }
  }, [stock_quantity, importPrice]);
  const handleSelectToEdit = (value: any) => {
    const dateOfEntry = moment(value.dateofentry).format("YYYY-MM-DD");
    setDateOfEnTry(dateOfEntry);
    setBrandName(value.brandname);
    setNameProduct(value.product_name);
    setStock_quantity(value.stock_quantity);
    setImportPrice(value.import_price);
    setTotal_price(value.total_price);
    setUnit(value.unit);
    setNote(value.note);

    let parsedColor = [];
    let parsedSize = [];
    try {
      parsedColor = value.color ? JSON.parse(value.color) : [];
    } catch (error) {
      console.error("Lỗi khi parse màu:", error);
    }
    try {
      parsedSize = value.size ? JSON.parse(value.size) : [];
    } catch (error) {
      console.error("Lỗi khi parse kích thước:", error);
    }
    setColorName(parsedColor);
    setSize(parsedSize);
  };
  const handleDelete = async (param: any) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const res: any = await deletePrdInStock(param.id);
        if (res) {
          toast.success("Xóa thành công !");
          setRefresh((prev) => !prev);
        }
      } catch (err: any) {
        toast.error("Lỗi liên quan đến network");
      }
    }
  };
  useEffect(() => {
    const getDataTable = async () => {
      try {
        const res: any = await getListInventory();
        if (res) {
          setDataTable(res.data);
        } else {
          toast.error("Lỗi khi lấy danh sách nhập hàng!");
        }
      } catch (err: any) {
        toast.error("Lỗi liên quan đến network");
      }
    };
    getDataTable();
  }, []);

  useEffect(() => {
    const getListProduct = async () => {
      try {
        const res: any = await getListInventory();
        if (res) {
          setDataTable(res.data);
        }
      } catch (err: any) {
        toast.error("Lỗi lấy dữ liệu kho");
      }
    };
    getListProduct();
  }, [refresh]);

  useEffect(() => {
    const getListProduct = async () => {
      try {
        const resListProduct: any = await GetListProducts();
        if (resListProduct) {
          setSelectProductId(resListProduct.data);
        }
      } catch (err: any) {
        toast.error("Lỗi lấy dữ liệu select");
      }
    };
    getListProduct();
  }, []);

  const handleAddPrdToStock = async () => {
    try {
      if (
        dateofentry &&
        brandName &&
        nameProduct &&
        stock_quantity &&
        importPrice &&
        unit &&
        total_price &&
        colorName &&
        size
      ) {
        let obj = {
          dateofentry: moment(dateofentry).format("YYYY-MM-DD"),
          brandname: brandName,
          product_name: nameProduct,
          stock_quantity: stock_quantity,
          import_price: importPrice,
          unit: unit,
          total_price: total_price,
          color: colorName,
          size: size,
          note: note,
        };
        const res: any = await addPrdToStock(obj);
        if (res) {
          toast.success("Nhập thành công!");
          setRefresh((prev) => !prev);
          setDateOfEnTry("");
          setBrandName("");
          setNameProduct("");
          setStock_quantity(0);
          setImportPrice(0);
          setTotal_price(0);
          setUnit("");
          setNote("");
          setColorName([]);
          setSize([]);
        } else {
          toast.error("Nhập thất bại !");
        }
      }
    } catch (err: any) {
      toast.error("Lỗi liên quan đến network !");
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setProductId(event.target.value as string);
  };
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <TextField
            id="date-picker"
            label="Ngày nhập"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={dateofentry}
            onChange={(e) => setDateOfEnTry(e.target.value)}
          />
        </div>
        <div className="col-2">
          <TextField
            id="brand"
            label="Thương hiệu"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2">
          <FormControl fullWidth size="small">
            <InputLabel id="product_id">Mã sản phẩm</InputLabel>
            <Select
              labelId="product_id"
              id="product_id"
              value={productId}
              label="Age"
              onChange={handleChange}
            >
              {selectProductId.map((item: any, index: number) => (
                <MenuItem key={index} value={item.id}>
                  {item.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-4">
          <TextField
            id="nameProduct"
            label="Tên sản phẩm"
            value={nameProduct}
            onChange={(e) => setNameProduct(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2">
          <TextField
            id=""
            label="Số lượng"
            value={stock_quantity}
            onChange={(e) => setStock_quantity(Number(e.target.value))}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2 mt-2">
          <TextField
            id="importPrice"
            label="Giá nhập"
            defaultValue=""
            value={importPrice}
            onChange={(e) => setImportPrice(Number(e.target.value))}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2 mt-2">
          <TextField
            id="unit"
            label="Đơn vị"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2 mt-2">
          <TextField
            id="total_price"
            label="Tổng tiền"
            defaultValue=""
            value={total_price}
            onChange={(e) => setTotal_price(Number(e.target.value))}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-3">
          <FormControl sx={{ m: 1, width: "100%" }}>
            <InputLabel id="color" size="small">
              Màu
            </InputLabel>
            <Select
              labelId="color"
              id="color"
              multiple
              value={colorName}
              size="small"
              onChange={handleChangeSelectChip}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {colors.map((color) => (
                <MenuItem
                  key={color}
                  value={color}
                  style={getStyles(color, colorName, theme)}
                >
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-3">
          <FormControl sx={{ m: 1, width: "100%" }}>
            <InputLabel id="size" size="small">
              Size
            </InputLabel>
            <Select
              labelId="size"
              id="size"
              multiple
              value={size}
              size="small"
              onChange={handleChangeSelectSizeChip}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {sizes.map((sizes) => (
                <MenuItem
                  key={sizes}
                  value={sizes}
                  style={getStyles(sizes, colorName, theme)}
                >
                  {sizes}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-9">
          <TextField
            id="note"
            label="Ghi chú"
            defaultValue=""
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-1 mt-1">
          <Button
            variant="contained"
            size="small"
            onClick={handleAddPrdToStock}
          >
            <ArchiveIcon fontSize="inherit" sx={{ marginRight: "5px" }} />
            NHẬP
          </Button>
        </div>
      </div>
      <div style={{ height: "480px" }}>
        <DataGrid
          rows={dataTable}
          columns={ColumnInventory(handleSelectToEdit, handleDelete)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0, height: "100%" }}
          paginationMode="client"
          onPaginationModelChange={setPaginationModel}
          // onCellDoubleClick={handleClicked}
          columnVisibilityModel={{ id: false }}
        />
      </div>
    </div>
  );
};

export default Inventory;
