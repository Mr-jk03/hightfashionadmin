import { AuthenticationModel, CategoryModal, ListStateModel } from "./EIgrid";

export const formAuthentication: AuthenticationModel = {
    userName: undefined,
    passWord: undefined
}
export const formCategory: CategoryModal={
  id: null,
  category_name: null,
  description: null,
  created_at: null,
}

export const InitialState: ListStateModel = [
  {
    //tabName: undefine
    form: {
      activeForm: 1,
      formStatus: null,
      formData: {
        formAuthentication: formAuthentication,
        formCategory: formCategory,
        formProduct: null,
        formOrder: null,
        formCustomer: null,
        formStatistical: null,
        formPromotion: null,
        formWareHouse: null,
      },
    },
  },
];


