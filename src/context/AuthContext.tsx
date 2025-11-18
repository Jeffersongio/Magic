import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { User } from '../types'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, phone: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function register(email: string, password: string, name: string, phone: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Salvar informações do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      phone,
      isAdmin: false
    })
    
    setCurrentUser({
      uid: user.uid,
      email: user.email || '',
      name,
      phone,
      isAdmin: false
    })
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Buscar dados do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      setCurrentUser({
        uid: user.uid,
        email: user.email || '',
        name: userData.name,
        phone: userData.phone,
        isAdmin: userData.isAdmin || false
      })
    } else {
      // Se não existe no Firestore, é admin padrão
      setCurrentUser({
        uid: user.uid,
        email: user.email || '',
        isAdmin: true
      })
    }
  }

  async function logout() {
    await signOut(auth)
    setCurrentUser(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name,
            phone: userData.phone,
            isAdmin: userData.isAdmin || false
          })
        } else {
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            isAdmin: true // Admin padrão se não está no Firestore
          })
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

