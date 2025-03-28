import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getListDiscount,
  GetListProducts,
  updateProduct,
} from "../../config/apiFunction";
import OutlinedInput from "@mui/material/OutlinedInput";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { getColumnProducts } from "../../ColumnTable/ColumnProducts";
import Swal from "sweetalert2";
import { Box } from "@mui/system";
import { colors, getStyles, MenuProps, sizes } from "./type";

const Product = () => {
  const theme = useTheme();
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDesCription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = React.useState("");
  const [selectCategory, setSelectCategory] = useState([]);
  const [discount, setDiscount] = React.useState("");
  const [selectDiscount, setSelectDiscount] = useState([]);
  const [statusBtn, setStatusBtn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [valueDiaLog, setValueDiaLog] = useState<any>([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [size, setSize] = React.useState<string[]>([]);
  const [dataTable, setDataTable] = useState({
    data: [],
    totalRows: 0,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const handleChange = (event: { target: { value: string } }) => {
    setCategory(event.target.value);
  };
  const handleChangeDiscount = (event: { target: { value: string } }) => {
    setDiscount(event.target.value);
  };

  useEffect(() => {
    const dataSelectField = async () => {
      try {
        const resCategory = await getCategories();
        if (resCategory) {
          setSelectCategory(resCategory.data);
        } else {
          toast.error("Lỗi lấy danh mục");
        }
        const resDiscount = await getListDiscount();
        if (resDiscount) {
          setSelectDiscount(resDiscount.data);
        } else {
          toast.error("Lỗi lấy mã giảm giá");
        }
      } catch (err: any) {
        toast.error("Lỗi lấy dữ liệu select");
      }
    };
    dataSelectField();
  }, []);
  useEffect(() => {
    const getListProduct = async () => {
      try {
        const resListProduct: any = await GetListProducts();
        if (resListProduct) {
          setDataTable({
            data: resListProduct.data,
            totalRows: resListProduct.totalItems,
          });
        }
      } catch (err: any) {
        toast.error("Lỗi lấy dữ liệu select");
      }
    };
    getListProduct();
  }, [refresh]);

  const [image, setImage] = useState("");

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]; // Lấy file đầu tiên
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file); // Chuyển file sang base64
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         setImage(reader.result.split(",")[1]);
  //       }
  //     };
  //   }
  // };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn xuống dòng
      setImage((prev) => prev + (prev ? ",\n" : "") + event.target.value);
    }
  };

  const handleAddProduct = async () => {
    if (!category || !productName || !productPrice || !quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
    } else {
      try {
        const res: any = addProduct(
          category,
          productName,
          image,
          description,
          productPrice,
          quantity,
          discount,
          personName,
          size
        );
        if (res) {
          toast.success("Thêm sản phẩm thành công !");
          setRefresh((prev) => !prev);
          setCategory("");
          setProductName("");
          setImage("");
          setDesCription("");
          setProductPrice("");
          setQuantity("");
          setDiscount("");
          setPersonName([]);
          setSize([]);
        }
      } catch (err: any) {
        toast.error("Lỗi thêm sản phẩm");
      }
    }
  };

  const handleClearAll = () => {
    setCategory("");
    setProductName("");
    setImage("");
    setDesCription("");
    setProductPrice("");
    setQuantity("");
    setDiscount("");
    setStatusBtn(false);
    setPersonName([]);
    setSize([]);
  };

  const handleSelectToEdit = (value: any) => {
    setStatusBtn(true);
    console.log("object", value);

    const categoryName: any = selectCategory.find(
      (o: any) => o.id == value.category_id
    );
    const disCount: any = selectDiscount.find(
      (o: any) => o.discount_percentage == value.discount
    );

    setProductId(value.id);
    setCategory(categoryName?.id || null);
    setProductName(value.product_name || "");
    setImage(value.product_image || "");
    setDesCription(value.description || "");
    setProductPrice(value.price || 0);
    setQuantity(value.stock_quantity || 0);
    setDiscount(disCount?.discount_percentage || 0);

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

    setPersonName(parsedColor);
    setSize(parsedSize);
  };

  const handleEditProduct = () => {
    if (!category && !productName && !productPrice && !quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
    } else {
      try {
        const res: any = updateProduct(
          productId,
          category,
          productName,
          image,
          description,
          productPrice,
          quantity,
          discount,
          personName,
          size
        );
        if (res) {
          toast.success("Cập nhật sản phẩm thành công !");
          setRefresh((prev) => !prev);
          setProductId("");
          setCategory("");
          setProductName("");
          setImage("");
          setDesCription("");
          setProductPrice("");
          setQuantity("");
          setDiscount("");
          setPersonName([]);
          setSize([]); 
        }
      } catch (err: any) {
        toast.error("Lỗi cập nhật sản phẩm");
      }
    }
  };
  const handleDelete = async (row: any) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa danh mục?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await deleteProduct(row.id);
        toast.success("Xóa sản phẩm thành công");
        setRefresh((prev) => !prev);
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  const handleClicked = (value: any) => {
    setValueDiaLog(value.row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelectChip = (
    event: SelectChangeEvent<typeof personName>
  ) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };
  const handleChangeSelectSizeChip = (
    event: SelectChangeEvent<typeof personName>
  ) => {
    const {
      target: { value },
    } = event;
    setSize(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <div className="row">
        <div className="col-4">
          <Select
            labelId="category-label"
            id="demo-customized-select"
            value={category}
            onChange={handleChange}
            size="small"
            fullWidth
            displayEmpty
            input={<OutlinedInput label="Tag" />}
          >
            <MenuItem value="" disabled>
              Chọn danh mục
            </MenuItem>
            {selectCategory.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.category_name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="col-8">
          <TextField
            id="product_name	"
            label="Tên sản phẩm"
            defaultValue=""
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2 mt-2">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            type="file"
            //onChange={handleFileChange}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" component="span" size="small" fullWidth>
              Chọn ảnh
            </Button>
          </label>
        </div>
        <div className="col-6 mt-2">
          <TextField
            id="product_image"
            label="Ảnh sản phẩm"
            defaultValue=""
            type="file"
            value={image}
            onKeyDown={handleKeyDown}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={5}
          />
        </div>
        <div className="col-4 mt-2">
          <TextField
            id="description"
            label="Mô tả sản phẩm"
            defaultValue=""
            value={description}
            onChange={(e) => setDesCription(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={5}
          />
        </div>

        <div className="col-2 mt-2">
          <TextField
            id="price"
            label="Giá"
            defaultValue=""
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-2 mt-2">
          <TextField
            id="stock_quantity"
            label="Số lượng"
            defaultValue=""
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="col-3 ">
          <FormControl sx={{ m: 1, width: "100%" }}>
            <InputLabel id="color" size="small">
              Màu
            </InputLabel>
            <Select
              labelId="color"
              id="color"
              multiple
              value={personName}
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
                  style={getStyles(color, personName, theme)}
                >
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-2">
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
                  style={getStyles(sizes, personName, theme)}
                >
                  {sizes}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-3 mt-2">
          <Select
            labelId="category-label"
            id="demo-customized-select"
            value={discount}
            onChange={handleChangeDiscount}
            size="small"
            fullWidth
            displayEmpty
            input={<OutlinedInput label="Tag" />}
          >
            <MenuItem value="" disabled>
              Chọn % giảm giá...
            </MenuItem>
            {selectDiscount.map((i: any, index: number) => (
              <MenuItem key={index} value={i.discount_percentage}>
                {i.discount_percentage}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="col-2 mt-2">
          {!statusBtn ? (
            <Button
              fullWidth
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={handleAddProduct}
            >
              Thêm
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              endIcon={<SettingsIcon />}
              color={"info"}
              onClick={handleEditProduct}
            >
              Sửa
            </Button>
          )}
        </div>
        <div className="col-2 mt-2">
          <Button
            fullWidth
            variant="contained"
            endIcon={<CleaningServicesIcon />}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>
      <div className="row mt-3">
        <Paper sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={dataTable.data}
            columns={getColumnProducts(handleSelectToEdit, handleDelete)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            paginationMode="client"
            onPaginationModelChange={setPaginationModel}
            onCellDoubleClick={handleClicked}
          />
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        PaperProps={{
          sx: { width: 750, height: 550 },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <span style={{ fontSize: "16px" }}>
            Sản phẩm: <b>{valueDiaLog?.product_name}</b>
          </span>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: "100%", width: "100%" }}>
            <div className="row">
              <div
                className="col-7 d-flex justify-content-center"
                style={{
                  height: "470px",
                  borderRight: "1px solid black",
                  position: "relative",
                }}
              >
                {valueDiaLog?.product_image ? (
                  valueDiaLog.product_image
                    .split(",")
                    .slice(0, 1)
                    .map((imgSrc: string, index: number) => (
                      <img
                        key={index}
                        style={{
                          height: "100%",
                          width: "90%",
                          display: "block",
                          marginBottom: "10px",
                        }}
                        src={imgSrc.trim()}
                        alt={`Product ${index}`}
                      />
                    ))
                ) : (
                  <span>Không có ảnh</span>
                )}

                <span
                  style={{
                    position: "absolute",
                    top: "45%",
                    right: "-25px",
                    transform: "rotate(-90deg)",
                  }}
                >
                  Ảnh mô tả
                </span>
              </div>
              <div className="col-5">
                <div
                  className="row d-flex justify-content-center"
                  style={{ height: "470px" }}
                >
                  {valueDiaLog?.product_image
                    ?.split(",")
                    .slice(0, 3)
                    .map((imgSrc: string, index: number) => (
                      <div
                        className="col-12 "
                        style={{ height: "155px", width: "250px" }}
                        key={index}
                      >
                        <img
                          src={imgSrc.trim()}
                          alt={`Thumbnail ${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Product;
