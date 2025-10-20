import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, filterProducts, sortByPrice, fetchProducts } from '../redux/cartSlice'
import Link from 'next/link'

export default function ProductList() {
  const dispatch = useDispatch()
  const products = useSelector((s) => s.cart.filteredProducts ?? [])
  const items = useSelector(state => state.cart.items)
  const loading = useSelector(s => s.cart.loading)
  const error = useSelector(s => s.cart.error)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className='md:flex items-start justify-between'>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white  rounded-lg shadow-sm mb-4">
          <input
            type="text"
            placeholder="🔍 Search products..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => dispatch(filterProducts(e.target.value))}
          />
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => dispatch(sortByPrice(e.target.value))}
          >
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <Link href={"/cart"} className="flex items-center bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm">
            🛒 <span className="ml-2">{items.length || 0} items</span>
          </Link>
        </div>
      </div>

      {loading && <div>Loading products...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3 mb-3 flex flex-col justify-between">
            <div>
            <img src={p.image} alt={p.title} className="h-40 w-full object-contain mb-3" />
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-sm text-gray-500 line-clamp-4">{p.description}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-semibold">₹{p.price}</div>
            {items.some(i => i.id === p.id)?<Link href={"/cart"} className="flex items-center bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm">
            View cart
              </Link>:
              <button
                onClick={() => dispatch(addToCart(p))}
                className="flex items-center bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm"
              >
             Add to cart
              </button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}