import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartIcon = ({ className = "" }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className={`relative ${className}`}>
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;