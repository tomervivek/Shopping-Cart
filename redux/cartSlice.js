// ...existing code...
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk('cart/fetchProducts', async () => {
  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return data
})

const initialState = {
  items: [],
  products: [],         
  filteredProducts: [], 
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...item, qty: 1 })
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    changeQty(state, action) {
      const { id, qty } = action.payload
      state.items = state.items.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
    },
    clearCart(state) {
      state.items = []
    },
    filterProducts(state, action) {
      const term = (action.payload || '').toString().trim().toLowerCase()
      if (!term) {
        state.filteredProducts = state.products
      } else {
        state.filteredProducts = state.products.filter(p =>
          (p.title || '').toString().toLowerCase().includes(term) ||
          (p.description || '').toString().toLowerCase().includes(term)
        )
      }
    },
    sortByPrice(state, action) {
      const order = (action.payload || '').toString().trim().toLowerCase()
      if (!order) {
        state.filteredProducts = state.products
        return
      }
      const source = (state.filteredProducts && state.filteredProducts.length) ? state.filteredProducts : state.products
      if (order === 'low' || order === 'asc') {
        state.filteredProducts = [...source].sort((a, b) => Number(a.price) - Number(b.price))
      } else if (order === 'high' || order === 'desc') {
        state.filteredProducts = [...source].sort((a, b) => Number(b.price) - Number(a.price))
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.filteredProducts = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message || 'Failed to load products'
      })
  }
})

export const { addToCart, removeFromCart, changeQty, clearCart, filterProducts, sortByPrice } = cartSlice.actions
export default cartSlice.reducer