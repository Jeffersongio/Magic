import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Card } from '../types'
import Logo from '../components/Logo'
import './Home.css'

export default function Home() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUser, logout } = useAuth()
  const { addToCart, getTotalItems } = useCart()

  useEffect(() => {
    const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Card[]
      setCards(cardsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  function handleAddToCart(card: Card) {
    addToCart(card, 1)
    alert(`${card.name} adicionada ao carrinho!`)
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Logo />
          <nav className="nav">
            <Link to="/">Home</Link>
            {currentUser?.isAdmin && (
              <Link to="/admin">Admin</Link>
            )}
            {currentUser ? (
              <>
                <Link to="/cart">
                  Carrinho
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </Link>
                <span>{currentUser.name || currentUser.email}</span>
                <Link to="/login" onClick={logout}>Sair</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Cadastro</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <h1 className="page-title">Cartas Disponíveis</h1>
        
        {loading ? (
          <div className="loading">Carregando cartas...</div>
        ) : cards.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma carta disponível no momento.</p>
            {currentUser?.isAdmin && (
              <Link to="/admin" className="btn btn-primary">
                Adicionar Primeira Carta
              </Link>
            )}
          </div>
        ) : (
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                {card.image && (
                  <img src={card.image} alt={card.name} className="card-image" />
                )}
                <div className="card-info">
                  <h3 className="card-name">{card.name}</h3>
                  <p className="card-description">{card.description}</p>
                  <div className="card-footer">
                    <span className="card-price">{formatPrice(card.price)}</span>
                    <span className="card-stock">Estoque: {card.quantity}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(card)}
                    disabled={card.quantity === 0}
                  >
                    {card.quantity > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

