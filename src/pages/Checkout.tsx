import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Checkout.css'

export default function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [pixCode, setPixCode] = useState('')
  const [loading, setLoading] = useState(false)

  // IMPORTANTE: Substitua pelo seu código PIX
  const defaultPixCode = '00020126360014BR.GOV.BCB.PIX0114+5511999999999020400005303986540510.005802BR5925SEU NOME COMPLETO AQUI6009SAO PAULO62070503***6304ABCD'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!currentUser || !currentUser.name || !currentUser.phone) {
      alert('Por favor, complete seu cadastro com nome e telefone antes de finalizar a compra.')
      navigate('/')
      return
    }

    try {
      setLoading(true)
      
      // Criar pedido no Firestore
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        userEmail: currentUser.email,
        items: cartItems,
        total: getTotalPrice(),
        status: 'pending',
        createdAt: serverTimestamp()
      })

      // Limpar carrinho
      clearCart()
      
      // Mostrar código PIX
      setPixCode(defaultPixCode)
      alert('Pedido criado com sucesso! Pague com PIX para finalizar.')
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  function copyPixCode() {
    navigator.clipboard.writeText(pixCode)
    alert('Código PIX copiado!')
  }

  return (
    <div className="app">
      <main className="container">
        <div className="checkout-container">
          <h1>Finalizar Compra</h1>

          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            {cartItems.map((item) => (
              <div key={item.card.id} className="order-item">
                <span>{item.card.name} x {item.quantity}</span>
                <span>{formatPrice(item.card.price * item.quantity)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>

          {currentUser && (
            <div className="user-info">
              <h2>Dados do Cliente</h2>
              <p><strong>Nome:</strong> {currentUser.name}</p>
              <p><strong>Telefone:</strong> {currentUser.phone}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
          )}

          {!pixCode ? (
            <form onSubmit={handleSubmit} className="checkout-form">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </form>
          ) : (
            <div className="pix-section">
              <h2>Pagamento via PIX</h2>
              <div className="pix-instructions">
                <p>1. Escaneie o QR Code abaixo ou copie o código PIX</p>
                <p>2. Realize o pagamento no valor de <strong>{formatPrice(getTotalPrice())}</strong></p>
                <p>3. Envie o comprovante para o vendedor</p>
              </div>
              
              <div className="pix-code-container">
                <div className="pix-code">
                  <textarea
                    readOnly
                    value={pixCode}
                    className="pix-code-input"
                  />
                  <button onClick={copyPixCode} className="btn btn-primary">
                    Copiar Código PIX
                  </button>
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  onClick={() => {
                    clearCart()
                    navigate('/')
                  }}
                  className="btn btn-secondary"
                >
                  Voltar para Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

