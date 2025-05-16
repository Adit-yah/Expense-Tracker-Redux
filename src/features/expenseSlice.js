import { createSlice } from "@reduxjs/toolkit";
import { createSelector} from 'reselect'

const initialState = {
    salary : 0,
    expenses : [],
    categories : [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Other",
    ],
    filter : {
        categories : 'All',
        month : new Date().getMonth(),
        year  : new Date().getFullYear()
    }
}



const expenseSlice = createSlice({
    name : 'expenses',
    initialState , 
    reducers : {
        setSalary : (state , action )=>{
            state.salary = action.payload
        },
        addExpense : (state , action)=>{
            state.expenses.push({
                id :  Date.now().toString() , 
                ...action.payload,
            })       
        },
        setfilter :(state , action)=>{
            state.filter = { ...state.filter , ...action.payload}
        },
        editExpense : (state , action)=>{
            const { id , ...update} = action.payload
            const expenseIndex = state.expenses.findIndex(exp => exp.id == id  )
            state.expenses[expenseIndex] = {
                ...state.expenses[expenseIndex] ,
                ...update ,
                amount : Number(update.amount)
            } 
        },
        deleteExpense : (state , action)=>{
            state.expenses = state.expenses.filter(obj => obj.id != action.payload)
        }
    }
})

export const selectSalary = state => state.expenses.salary
export const selectCategories = state => state.expenses.categories
export const selectFilter = state => state.expenses.filter
export const expensesArray = state => state.expenses.expenses

export const selectExpenses = createSelector([selectFilter , expensesArray] , (filter , expenses)=>{
    const { categories , month , year} = filter
    return expenses.filter( (expense)=>{
        const expenseDate = new Date(expense.date)
        const matchMonth = expenseDate.getMonth() == month
        const matchYear = expenseDate.getFullYear() == year
        const mathcategory = categories == expense.category  || categories == 'All'

        return matchMonth && matchYear && mathcategory
    })
})

// export const selectExpenses = (state) => {
//     const { categories , month , year} = state.expenses.filter

//     return  state.expenses.expenses.filter( (expense) =>{
//         const expenseDate = new Date(expense.date)
//         const matchMonth = expenseDate.getMonth() == month 
//         const matchYear = expenseDate.getFullYear() == year
//         const matchCategories = categories == 'All' || expense.category == categories
        
//         return matchYear && matchMonth && matchCategories
//     })
// } 

export const totalExpenses = (state) => {
    const filterExpenses = selectExpenses(state)
    return filterExpenses.reduce((total , exp)=> total += exp.amount , 0 )
}

export const remaningSalary = state => {
    const totalExpense = totalExpenses(state)
    return  state.expenses.salary - totalExpense
}


export const { setSalary , addExpense , setfilter , editExpense , deleteExpense } = expenseSlice.actions


export default expenseSlice.reducer

