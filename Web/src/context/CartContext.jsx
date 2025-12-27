import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'tecsim_cart';

// Função para carregar do localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    return { items: [] };
  }
};

// Função para salvar no localStorage
const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id_medicamento === action.payload.id_medicamento);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id_medicamento === action.payload.id_medicamento
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id_medicamento !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id_medicamento === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  const addToCart = (medicine) => {
    dispatch({ type: 'ADD_ITEM', payload: medicine });
  };

  const removeFromCart = (medicineId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: medicineId });
  };

  const updateQuantity = (medicineId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: medicineId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.preco * item.quantity), 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};