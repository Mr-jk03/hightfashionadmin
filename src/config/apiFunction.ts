import apiClient from "./apiClient";

export const Login = async (email: string, password: string) => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

export const getTotalCustomer = async () => {
  const res = await apiClient.get("/totalcustomer");
  return res.data;
};

export const addCategory = async (
  category_name: string,
  brand: string,
  description: string
) => {
  const res = await apiClient.post("/addCategory", {
    category_name,
    brand,
    description,
  });
  return res.data;
};
export const getCategories = async () => {
  const res = await apiClient.get("/getallcategoryadmin");
  return res.data;
};
export const deleteCategory = async (id: string) => {
  const res = await apiClient.delete(`/deleteCategory?id=${id}`);
  return res.data;
};
export const updateCategory = async (
  category_name: string,
  brand: string,
  description: string,
  id: string
) => {
  const res = await apiClient.patch("/updateCategory", {
    category_name,
    brand,
    description,
    id,
  });
  return res.data;
};
export const getListCustomer = async () => {
  const res = await apiClient.get("/getListCustomer");
  return res.data;
};

export const deleteCustomer = async (id: string) => {
  const res = await apiClient.delete(`/deleteUser?id=${id}`);
  return res.data;
};

export const getBannerList = async () => {
  const res = await apiClient.get("/getBannerList");
  return res.data;
};
export const addBanner = async (link_banner: string) => {
  const res = await apiClient.post("/addBanner", { link_banner });
  return res.data;
};
export const deleteBanner = async (id: any) => {
  const res = await apiClient.delete(`/deleteBanner?id=${id}`);
  return res.data;
};

export const getListDiscount = async () => {
  const res = await apiClient.get("/getListDiscount");
  return res.data;
};
export const addDisCount = async (
  discount_code: string,
  discount_percentage: any,
  valid_from: string,
  valid_until: string
) => {
  const res = await apiClient.post("/addDiscountCode", {
    discount_code,
    discount_percentage,
    valid_from,
    valid_until,
  });
  return res.data;
};
export const deleteDiscount = async (id: string) => {
  const res = await apiClient.delete(`/deleteDiscount?id=${id}`);
  return res.data;
};

export const addProduct = async (
  category_id: string,
  product_name: string,
  product_image: string,
  description: string,
  price: string,
  stock_quantity: string,
  discount: string,
  color: string[],
  size: string[]
) => {
  const res = await apiClient.post("/addProduct", {
    category_id,
    product_name,
    product_image,
    description,
    price,
    stock_quantity,
    discount,
    color: JSON.stringify(color),
    size: JSON.stringify(size),
  });
};

export const GetListProducts = async () => {
  const res = await apiClient.get("/getListProducts");
  return res.data;
};
export const updateProduct = async (
  id: string,
  category_id: string,
  product_name: string,
  product_image: string,
  description: string,
  price: string,
  stock_quantity: string,
  discount: string,
  color: string[],
  size: string[]
) => {
  const res = await apiClient.patch("/updateProduct", {
    id,
    category_id,
    product_name,
    product_image,
    description,
    price,
    stock_quantity,
    discount,
    color: JSON.stringify(color),
    size: JSON.stringify(size),
  });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await apiClient.delete(`/deleteProduct?id=${id}`);
  return res.data;
};
export const getDataPieChar = async () => {
  const res = await apiClient.get("/getdataPieChar");
  return res.data;
};

export const getDataLineChart = async () => {
  const res = await apiClient.get("/getDataDashboard");
  return res.data;
};

export const getListInventory = async () => {
  const res = await apiClient.get("/getListInventory");
  return res.data;
};
export const addPrdToStock = async (data: any) => {
  const res = await apiClient.post("/addPrdtoStock", {
    dateofentry: data.dateofentry,
    brandname: data.brandname,
    product_id: data.productId,
    product_name: data.product_name,
    stock_quantity: data.stock_quantity,
    import_price: data.import_price,
    unit: data.unit,
    total_price: data.total_price,
    color: JSON.stringify(data.color),
    size: JSON.stringify(data.size),
    note: data?.note,
  });
  return res.data;
};

export const deletePrdInStock = async (id: any) => {
  const res = await apiClient.delete(`/deletePrdInStock?id=${id}`);
  return res.data;
};

export const updateOrderStatus = async (
  order_status: string,
  products: { product_id: number; quantity: number }[],
  id: number
) => {
  const res = await apiClient.put("/updateStatusOrder", {
    order_status,
    products,
    id,
  });
  return res.data;
};


export const getListStaffwarehouse = async () => {
  const res = await apiClient.get("/getListwarehouse");
  return res.data;
};
export const addStaffwareHouse = async (data: any) => {
  const res = await apiClient.post("/addNewUser", {
    full_name: data.staffName,
    email: data.staffEmail,
    password: data.staffPass,
    phone: data.staffMobile,
    address: data.staffAddress,
    role: data.staffRole,
  });
  return res.data;
};
