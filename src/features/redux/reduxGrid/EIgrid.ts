export interface StateModel {
  //tabName : string,
  form: {
    activeForm: number,
    formStatus: number | null,
    formData: {
      formAuthentication: AuthenticationModel,
      formCategory: CategoryModal,
      formProduct: '' | null,
      formOrder: '' | null,
      formCustomer: ''| null,
      formStatistical: '' | null,
      formPromotion: '' | null,
      formWareHouse: '' | null,
    };
  };
}

export interface ListStateModel extends Array<StateModel> {}

export interface AuthenticationModel{
    userName?: string,
    role?: string,
}

export interface CategoryModal{
  id: string | null,
  category_name: string | null,
  description: string | null,
  created_at: Date | null
}