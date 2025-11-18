# 📋 Como Copiar as Credenciais do Firebase

## 🔍 Onde encontrar suas credenciais no Firebase Console

### Método 1: Pela página de configurações (RECOMENDADO)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto **"magic-cards-store-a00fd"**
3. Clique no **ícone de engrenagem ⚙️** ao lado de "Visão geral do projeto"
4. Clique em **"Configurações do projeto"** (Project settings)
5. Role a página até encontrar a seção **"Seus apps"** (Your apps)
6. Você verá seu app web listado, clique no ícone **`</>`** ou no nome do app
7. Você verá algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

8. **IMPORTANTE**: 
   - Copie **TODA** a API key (começa com `AIzaSy` e tem cerca de 39 caracteres)
   - Certifique-se de copiar sem espaços extras
   - Não copie caracteres especiais ou quebras de linha

### Método 2: Pela página inicial do projeto

1. Acesse seu projeto no Firebase Console
2. Na página inicial, você verá seu app web
3. Clique em **"Configuração"** ou **"Settings"** (ícone de engrenagem)
4. Role até ver o `firebaseConfig`
5. Copie as credenciais

---

## ✅ Verificação das Credenciais

### API Key
- ✅ Deve começar com `AIzaSy`
- ✅ Deve ter aproximadamente 39 caracteres
- ✅ Não deve ter espaços
- ❌ Não deve ter `YOUR_API_KEY` ou `...` no meio

**Exemplo correto**: `AIzaSyB4wzedvWzxV0d15SMTw_IKfh_qWcScZSc`

### Auth Domain
- ✅ Deve ter o formato: `seu-projeto.firebaseapp.com`
- ✅ Ou: `seu-projeto.web.app`

**Exemplo correto**: `magic-cards-store-a00fd.firebaseapp.com`

### Project ID
- ✅ Geralmente é o nome do projeto em minúsculas
- ✅ Pode ter hífens e números

**Exemplo correto**: `magic-cards-store-a00fd`

---

## 🐛 Se ainda não funcionar

### Verifique:
1. ✅ O projeto está ativo no Firebase Console?
2. ✅ Você copiou a API key **COMPLETA** (sem cortes)?
3. ✅ Não há espaços extras antes ou depois das aspas?
4. ✅ O arquivo foi salvo após a edição?

### Teste:
1. Abra o arquivo `src/firebase/config.ts`
2. Verifique se as credenciais estão entre aspas duplas `"`
3. Certifique-se de que não há caracteres estranhos
4. Salve o arquivo novamente (Ctrl+S)
5. Reinicie o servidor (`npm run dev`)

---

## 📝 Template Correto

Quando copiar, o arquivo deve ficar assim:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...completa sem espaços...",
  authDomain: "magic-cards-store-a00fd.firebaseapp.com",
  projectId: "magic-cards-store-a00fd",
  storageBucket: "magic-cards-store-a00fd.appspot.com",
  messagingSenderId: "108927871470",
  appId: "1:108927871470:web:..."
}
```

**NOTA**: Certifique-se de que a API key está COMPLETA e sem cortes!

