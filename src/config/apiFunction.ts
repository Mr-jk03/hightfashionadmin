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
  description: string
) => {
  const res = await apiClient.post("/addCategory", {
    category_name,
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
  description: string,
  id: string
) => {
  const res = await apiClient.patch("/updateCategory", {
    category_name,
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
export const deleteBanner = async (id: any)=>{
    const res = await apiClient.delete(`/deleteBanner?id=${id}`)
    return res.data
}

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
  discount: string
) => {
  const res = await apiClient.post("/addProduct", {
    category_id,
    product_name,
    product_image,
    description,
    price,
    stock_quantity,
    discount,
  });
  return res.data;
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
  discount: string
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
  });
  return res.data;
};

export const deleteProduct =async(id: string)=>{
    const res = await apiClient.delete(`/deleteProduct?id=${id}`)
    return res.data
}
export const getDataPieChar = async()=>{
  const res = await apiClient.get('/getdataPieChar')
  return res.data
}
