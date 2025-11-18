import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { CartItem, Card } from '../types'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (card: Card, quantity?: number) => void
  removeFromCart: (cardId: string) => void
  updateQuantity: (cardId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(card: Card, quantity: number = 1) {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.card.id === card.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.card.id === card.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { card, quantity }]
    })
  }

  function removeFromCart(cardId: string) {
    setCartItems(prevItems => prevItems.filter(item => item.card.id !== cardId))
  }

  function updateQuantity(cardId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(cardId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.card.id === cardId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  function getTotalPrice() {
    return cartItems.reduce((total, item) => total + item.card.price * item.quantity, 0)
  }

  function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

