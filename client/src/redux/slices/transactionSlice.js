import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as transactionService from '../../services/transactionService'

const getError = (error) =>
  error.response?.data?.message ||
  error.message ||
  'Something went wrong'


// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactions(params)

      return response.data
    } catch (error) {
      return rejectWithValue(getError(error))
    }
  }
)


// Create or update transaction
export const saveTransaction = createAsyncThunk(
  'transactions/save',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      let response

      if (id) {
        response = await transactionService.updateTransaction(id, data)
      } else {
        response = await transactionService.createTransaction(data)
      }

      return response.data.data
    } catch (error) {
      return rejectWithValue(getError(error))
    }
  }
)


// Delete transaction
export const removeTransactionById = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id)

      return id
    } catch (error) {
      return rejectWithValue(getError(error))
    }
  }
)


const initialState = {
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  },
  loading: false,
  error: '',
  filters: {},
  selectedTransaction: null
}


const transactionSlice = createSlice({
  name: 'transactions',

  initialState,

  reducers: {

    setTransactions: (state, action) => {
      state.transactions = action.payload
    },

    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setFilters: (state, action) => {
      state.filters = action.payload
    },

    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = action.payload
    },

    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload)
    },

    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (item) => item._id === action.payload._id
      )

      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },

    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (item) => item._id !== action.payload
      )
    }
  },

  extraReducers: (builder) => {

    // FETCH TRANSACTIONS

    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = ''
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false

        state.transactions =
          action.payload.data ||
          action.payload.transactions ||
          []

        state.pagination =
          action.payload.pagination ||
          state.pagination
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch transactions'
      })


    // SAVE TRANSACTION

    builder
      .addCase(saveTransaction.pending, (state) => {
        state.loading = true
        state.error = ''
      })

      .addCase(saveTransaction.fulfilled, (state, action) => {
        state.loading = false

        const transaction = action.payload

        const index = state.transactions.findIndex(
          (item) => item._id === transaction._id
        )

        if (index !== -1) {
          state.transactions[index] = transaction
        } else {
          state.transactions.unshift(transaction)
        }
      })

      .addCase(saveTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to save transaction'
      })


    // DELETE TRANSACTION

    builder
      .addCase(
        removeTransactionById.fulfilled,
        (state, action) => {
          state.loading = false

          state.transactions =
            state.transactions.filter(
              (item) => item._id !== action.payload
            )
        }
      )

      .addCase(
        removeTransactionById.pending,
        (state) => {
          state.loading = true
          state.error = ''
        }
      )

      .addCase(
        removeTransactionById.rejected,
        (state, action) => {
          state.loading = false
          state.error =
            action.payload ||
            'Failed to delete transaction'
        }
      )
  }
})


export const {
  setTransactions,
  setLoading,
  setFilters,
  setSelectedTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction
} = transactionSlice.actions


export default transactionSlice.reducer