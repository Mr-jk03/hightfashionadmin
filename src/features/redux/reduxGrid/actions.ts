export interface ADDADMIN {
  type: "ADDADMIN";
  payload: AUTHENTICATION;
}
export interface AUTHENTICATION {
  userName?: string | null;
  role?: string | null;
}

export interface ADDCATEGORY {
  type: "ADDCATEGORY";
  payload: ADDCATEGORYITEM;
}
export interface ADDCATEGORYITEM {
  categorydata: any
}

export type ActionTypes = ADDADMIN | ADDCATEGORY;
