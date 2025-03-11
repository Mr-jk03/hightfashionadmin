import { Reducer } from "@reduxjs/toolkit";
import { ActionTypes, ADDCATEGORYITEM, AUTHENTICATION } from "./actions";
import { InitialState } from "./model";


export const action = {
    auThen: (data: AUTHENTICATION)=>({type: 'ADDADMIN', payload: data}),
    addCategory: (data: ADDCATEGORYITEM) =>({type: 'ADDCATEGORY', payload: data})
}

export const fashionReducer =  (state = InitialState, action:ActionTypes )=> {
    switch(action.type){
        case 'ADDADMIN':
            const newState = JSON.parse(JSON.stringify(state))
            const adminAuth = newState[0]
            if(adminAuth){
                newState[0].form.formData.formAuthentication.userName = action.payload.userName
                newState[0].form.formData.formAuthentication.passWord = action.payload.passWord
            }
            return newState
        case 'ADDCATEGORY':
            const newCategoryState = JSON.parse(JSON.stringify(state))
            const category = action.payload.categorydata
            if(category){
                category.form.formData.formCategory.id = action.payload.categorydata.id
                category.form.formData.formCategory.category_name = action.payload.categorydata.category_name
                category.form.formData.formCategory.description = action.payload.categorydata.description
            }
            return newCategoryState
        default:
            return state
    }
}

export default fashionReducer;