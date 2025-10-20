import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, changeQty, clearCart } from '../redux/cartSlice'

export default function Cart() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          🛒 Cart
        </h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Clear All
        </button>
      </div>

      {/* Empty Cart */}
      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-lg">Your cart is empty 😕</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-sm transition"
            >
              {/* Product Info */}
              <div>
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500">
                  ₹{item.price} × {item.qty}
                </div>
              </div>

              {/* Quantity Controls + Remove */}
              <div className="flex items-center gap-4">
                {/* Qty Buttons */}
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                  <button
                    disabled={item.qty < 2}
                    onClick={() =>
                      dispatch(changeQty({ id: item.id, qty: item.qty - 1 }))
                    }
                    className={`px-2 py-1 rounded text-white font-bold transition
                      ${
                        item.qty < 2
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                  >
                    −
                  </button>

                  <span className="px-3 text-gray-700 font-semibold">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(changeQty({ id: item.id, qty: item.qty + 1 }))
                    }
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 hover:text-red-600 font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 border-t pt-4 flex justify-between items-center text-lg font-semibold">
        <span className="text-gray-700">Total:</span>
        <span className="text-green-600">₹{total}</span>
      </div>

      {items.length > 0 && (
        <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-medium shadow transition">
          Proceed to Checkout
        </button>
      )}
    </div>
  )
}
