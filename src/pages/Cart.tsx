import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import './Cart.css'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { currentUser, logout } = useAuth()

  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (cartItems.length === 0) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <Logo />
            <nav className="nav">
              <Link to="/">Home</Link>
              {currentUser && <Link to="/cart">Carrinho</Link>}
              {currentUser ? (
                <Link to="/login" onClick={logout}>Sair</Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="container">
          <div className="empty-cart">
            <h2>Seu carrinho está vazio</h2>
            <Link to="/" className="btn btn-primary">
              Ver Cartas
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Logo />
          <nav className="nav">
            <Link to="/">Home</Link>
            {currentUser && <Link to="/cart">Carrinho</Link>}
            {currentUser ? (
              <Link to="/login" onClick={logout}>Sair</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container">
        <div className="cart-header">
          <h1>Carrinho de Compras</h1>
          <button onClick={clearCart} className="btn btn-secondary">
            Limpar Carrinho
          </button>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.card.id} className="cart-item">
              {item.card.image && (
                <img src={item.card.image} alt={item.card.name} className="cart-item-image" />
              )}
              <div className="cart-item-info">
                <h3>{item.card.name}</h3>
                <p>{item.card.description}</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-price">
                  {formatPrice(item.card.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeFromCart(item.card.id)}
                  className="btn btn-danger"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Total:</span>
            <span className="total-price">{formatPrice(getTotalPrice())}</span>
          </div>
          {currentUser ? (
            <Link to="/checkout" className="btn btn-success">
              Finalizar Compra
            </Link>
          ) : (
            <div className="login-prompt">
              <p>Faça login para finalizar a compra</p>
              <Link to="/login" className="btn btn-primary">
                Fazer Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

