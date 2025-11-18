import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { Card, Order } from '../types'
import Logo from '../components/Logo'
import './AdminDashboard.css'

interface ScryfallCard {
  id: string
  name: string
  oracle_text?: string
  mana_cost?: string
  type_line?: string
  image_uris?: {
    normal?: string
    large?: string
    small?: string
  }
  prices?: {
    usd?: string
  }
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    quantity: ''
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ScryfallCard[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Buscar cartas
    const cardsQuery = query(collection(db, 'cards'), orderBy('createdAt', 'desc'))
    const unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Card[]
      setCards(cardsData)
    })

    // Buscar pedidos
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
      setOrders(ordersData)
    })

    return () => {
      unsubscribeCards()
      unsubscribeOrders()
    }
  }, [])

  // Buscar cartas na API do Scryfall
  async function searchCards(query: string) {
    if (query.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=released&unique=prints`
      )
      
      if (response.status === 404) {
        setSearchResults([])
        setShowResults(true)
        setSearching(false)
        return
      }

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        setSearchResults(data.data.slice(0, 10)) // Limitar a 10 resultados
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(true)
      }
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
      setSearchResults([])
      setShowResults(false)
    } finally {
      setSearching(false)
    }
  }

  // Debounce na busca
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setFormData({ ...formData, name: value })

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchCards(value)
    }, 500) // Aguarda 500ms após parar de digitar
  }

  // Selecionar carta da lista
  function selectCard(card: ScryfallCard) {
    const description = card.oracle_text || card.type_line || ''
    const imageUrl = card.image_uris?.large || card.image_uris?.normal || card.image_uris?.small || ''
    
    setFormData({
      name: card.name,
      description: description,
      price: card.prices?.usd ? (parseFloat(card.prices.usd) * 5).toFixed(2) : '', // Converter USD para BRL aproximado
      image: imageUrl,
      quantity: formData.quantity || '1'
    })
    
    setSearchQuery(card.name)
    setShowResults(false)
    setSearchResults([])
  }

  // Fechar resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    
    // Validar se o nome foi preenchido
    if (!formData.name || formData.name.trim() === '') {
      alert('Por favor, selecione ou digite o nome da carta')
      return
    }

    // Validar se o preço foi preenchido
    if (!formData.price || formData.price.trim() === '') {
      alert('Por favor, preencha o preço da carta')
      return
    }

    // Validar se a quantidade foi preenchida
    if (!formData.quantity || formData.quantity.trim() === '') {
      alert('Por favor, preencha a quantidade em estoque')
      return
    }

    // Validar valores numéricos
    const price = parseFloat(formData.price)
    const quantity = parseInt(formData.quantity)

    if (isNaN(price) || price <= 0) {
      alert('Por favor, insira um preço válido (maior que zero)')
      return
    }

    if (isNaN(quantity) || quantity < 0) {
      alert('Por favor, insira uma quantidade válida (zero ou maior)')
      return
    }

    // Verificar se o usuário é admin
    if (!currentUser?.isAdmin) {
      alert('Acesso negado. Você precisa ser administrador para adicionar cartas.')
      return
    }
    
    try {
      setLoading(true)
      await addDoc(collection(db, 'cards'), {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        price: price,
        image: formData.image.trim() || '',
        quantity: quantity,
        createdAt: serverTimestamp()
      })
      setFormData({ name: '', description: '', price: '', image: '', quantity: '' })
      setSearchQuery('')
      setSearchResults([])
      setShowResults(false)
      setShowAddForm(false)
      alert('Carta adicionada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao adicionar carta:', error)
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao adicionar carta. '
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Permissão negada. Verifique se você é administrador e se as regras do Firestore estão configuradas corretamente.'
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'Você não está autenticado. Faça login novamente.'
      } else if (error.code === 'unavailable') {
        errorMessage += 'Serviço temporariamente indisponível. Verifique sua conexão com a internet.'
      } else if (error.message) {
        errorMessage += error.message
      } else {
        errorMessage += 'Tente novamente. Se o problema persistir, verifique o console do navegador (F12) para mais detalhes.'
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCard(cardId: string) {
    if (confirm('Tem certeza que deseja excluir esta carta?')) {
      try {
        await deleteDoc(doc(db, 'cards', cardId))
        alert('Carta excluída com sucesso!')
      } catch (error: any) {
        console.error('Erro ao excluir carta:', error)
        alert('Erro ao excluir carta.')
      }
    }
  }

  async function handleUpdateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status })
      alert('Status do pedido atualizado!')
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error)
      alert('Erro ao atualizar pedido.')
    }
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
            <Link to="/cart">Carrinho</Link>
            <span>{currentUser?.email}</span>
            <Link to="/login" onClick={logout}>Sair</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="admin-header">
          <h1>Painel Administrativo</h1>
          <button 
            onClick={() => {
              if (showAddForm) {
                // Limpar tudo ao fechar
                setFormData({ name: '', description: '', price: '', image: '', quantity: '' })
                setSearchQuery('')
                setSearchResults([])
                setShowResults(false)
              }
              setShowAddForm(!showAddForm)
            }} 
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancelar' : 'Adicionar Nova Carta'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-card-form">
            <h2>Adicionar Nova Carta</h2>
            <form onSubmit={handleAddCard}>
              <div className="form-row">
                <div className="form-group card-search-container">
                  <label>Nome da Carta:</label>
                  <div className="search-wrapper" ref={searchInputRef}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowResults(true)
                      }}
                      required
                      placeholder="Digite o nome da carta (ex: Black Lotus)"
                      className="card-search-input"
                    />
                    {searching && (
                      <div className="search-loading">Buscando...</div>
                    )}
                    {showResults && searchResults.length > 0 && (
                      <div className="search-results">
                        {searchResults.map((card) => (
                          <div
                            key={card.id}
                            className="search-result-item"
                            onClick={() => selectCard(card)}
                          >
                            {card.image_uris?.small && (
                              <img
                                src={card.image_uris.small}
                                alt={card.name}
                                className="search-result-image"
                              />
                            )}
                            <div className="search-result-info">
                              <div className="search-result-name">{card.name}</div>
                              {card.mana_cost && (
                                <div className="search-result-mana">{card.mana_cost}</div>
                              )}
                              {card.type_line && (
                                <div className="search-result-type">{card.type_line}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
                      <div className="search-results">
                        <div className="search-no-results">Nenhuma carta encontrada</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Preço (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Descrição da carta"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>URL da Imagem:</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Quantidade em Estoque:</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Carta'}
              </button>
            </form>
          </div>
        )}

        <div className="admin-sections">
          <div className="admin-section">
            <h2>Cartas ({cards.length})</h2>
            <div className="cards-list">
              {cards.map((card) => (
                <div key={card.id} className="admin-card-item">
                  {card.image && (
                    <img src={card.image} alt={card.name} className="admin-card-image" />
                  )}
                  <div className="admin-card-info">
                    <h3>{card.name}</h3>
                    <p>{card.description}</p>
                    <div className="admin-card-details">
                      <span>{formatPrice(card.price)}</span>
                      <span>Estoque: {card.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="btn btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Pedidos ({orders.length})</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="admin-order-item">
                  <div className="order-header">
                    <div>
                      <strong>{order.userName}</strong>
                      <p>Tel: {order.userPhone}</p>
                      {order.userEmail && <p>Email: {order.userEmail}</p>}
                    </div>
                    <div className={`status-badge status-${order.status}`}>
                      {order.status === 'pending' && 'Pendente'}
                      {order.status === 'completed' && 'Concluído'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span>{item.card.name} x {item.quantity}</span>
                        <span>{formatPrice(item.card.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: {formatPrice(order.total)}</strong>
                    </div>
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            className="btn btn-success"
                          >
                            Marcar como Concluído
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="btn btn-danger"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

