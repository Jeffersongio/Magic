import miirymLogo from '../context/miirym-art.jpg'
import './Logo.css'

export default function Logo() {
  return (
    <div className="logo">
      <img src={miirymLogo} alt="Cartinhas do Jef" className="logo-image" />
      <span className="logo-text">Cartinhas do Jef</span>
    </div>
  )
}

