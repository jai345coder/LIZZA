import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const getItemId = (it) => it._id || it.itemId || it.id || it.name;
      const targetId = getItemId(item);

      const existingIndex = prev.findIndex(
        (i) =>
          getItemId(i) === targetId &&
          i.size === item.size &&
          JSON.stringify(i.toppings || []) === JSON.stringify(item.toppings || [])
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity || 1;
        return updated;
      }

      const itemPrice = item.price !== undefined ? item.price : item.unitPrice || 0;

      return [
        ...prev,
        {
          ...item,
          itemId: targetId,
          unitPrice: itemPrice,
          price: itemPrice,
          quantity: item.quantity || 1,
        },
      ];
    });
  };

  const updateQuantity = (cartIndex, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartIndex);
      return;
    }
    setCartItems((prev) =>
      prev.map((item, idx) => (idx === cartIndex ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartIndex) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== cartIndex));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const estimatedTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price || item.unitPrice || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedAddressId,
        setSelectedAddressId,
        appliedCoupon,
        setAppliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        estimatedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;