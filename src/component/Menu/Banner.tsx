import { Button, Dialog, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { ColumnBanner } from "../../ColumnTable/ColumnBanner";
import {
  addBanner,
  deleteBanner,
  getBannerList,
} from "../../config/apiFunction";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";

const Banner = () => {
  const categoryInputForcus = useRef<HTMLInputElement>(null);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [banner, setBanner] = useState<string>();
  const [valueBannerImage, setValueBannerImage] = useState("");
  const [dataTable, setDataTable] = useState<any>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    data: [],
  });
  const paginationModel = { page: dataTable.currentPage, pageSize: 10 };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBannerList();
        const updatedData = res.banner.map((item: any, index: number) => ({
          ...item,
          stt: index + 1,
          link_banner: item.link_banner,
        }));
        setDataTable({
          totalItems: res.total,
          totalPages: 1,
          currentPage: 1,
          data: updatedData,
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchData();
  }, [refresh]);

  const handleAddcategory = async () => {
    if (!banner) {
      toast.warning("Vui lòng điền link banner");
    } else {
      try {
        await addBanner(banner);
        setBanner("");
        toast.success("Thêm banner thành công");
        setRefresh((prev) => !prev);
        categoryInputForcus.current?.focus();
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  
  const handleDelete = async (row: any) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa Banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await deleteBanner(row.id);
        toast.success("Xóa Banner thành công");
        setRefresh((prev) => !prev);
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  const handleShowBannerImage = (value: any) => {
    setOpen(true);
    setValueBannerImage(value.row.link_banner);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="row">
        <div className="col-8">
          <TextField
            id="outlined-error"
            label="Link ảnh"
            defaultValue=""
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            fullWidth
            size="small"
            inputRef={categoryInputForcus}
          />
        </div>
        <div className="col-2">
          <Button
            fullWidth
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={handleAddcategory}
          >
            Thêm
          </Button>
        </div>
      </div>
      <div className="row mt-3">
        <Paper>
          <DataGrid
            rows={dataTable.data}
            columns={ColumnBanner(handleDelete)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            //onRowSelectionModelChange={handleSelectRow}
            sx={{ border: 0 }}
            onCellDoubleClick={handleShowBannerImage}
            columnVisibilityModel={{id: false}}
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
          sx: { width: 950, height: 450, padding: 10 },
        }}
      >
        <img
          src={valueBannerImage}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
      </Dialog>
    </>
  );
};

export default Banner;
