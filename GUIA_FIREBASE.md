# 🔥 Guia de Configuração do Firebase

Este guia vai te ajudar a configurar o Firebase no seu projeto Magic Cards Store.

## 📋 Passo a Passo

### 1️⃣ Criar Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Digite um nome para o projeto (ex: "magic-cards-store")
4. Aceite os termos e clique em **"Continuar"**
5. Desative o Google Analytics (ou deixe ativado se quiser)
6. Clique em **"Criar projeto"**
7. Aguarde a criação e clique em **"Continuar"**

### 2️⃣ Criar Aplicativo Web

1. Na tela do projeto, você verá ícones para diferentes plataformas
2. Clique no ícone **"Web"** (`</>`)
3. Dê um nome para o app (ex: "Magic Cards Store")
4. **NÃO marque** "Also set up Firebase Hosting" (não vamos usar agora)
5. Clique em **"Registrar app"**
6. **COPIE as credenciais** que aparecem (firebaseConfig)

Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3️⃣ Configurar Authentication (Autenticação)

1. No menu lateral esquerdo, clique em **"Authentication"**
2. Clique em **"Começar"** ou **"Get started"**
3. Vá na aba **"Sign-in method"** (Métodos de entrada)
4. Clique em **"Email/Password"**
5. Ative o primeiro switch (Email/Password)
6. Clique em **"Salvar"**

✅ Pronto! Authentication configurado.

### 4️⃣ Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. Escolha **"Começar em modo de teste"** (Start in test mode)
4. Selecione uma localização (escolha a mais próxima do Brasil, ex: `southamerica-east1`)
5. Clique em **"Ativar"** ou **"Enable"**

⚠️ **IMPORTANTE**: Depois vamos configurar as regras de segurança.

### 5️⃣ Configurar Regras de Segurança do Firestore

1. No Firestore Database, vá na aba **"Regras"** (Rules)
2. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para as cartas
    match /cards/{document=**} {
      // Todos podem ler as cartas
      allow read: if true;
      // Só admin pode escrever (criar, editar, deletar)
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Regras para usuários
    match /users/{userId} {
      // Usuário autenticado pode ler qualquer perfil
      allow read: if request.auth != null;
      // Usuário só pode escrever no próprio perfil
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para pedidos
    match /orders/{orderId} {
      // Usuário autenticado pode ler pedidos
      allow read: if request.auth != null;
      // Usuário autenticado pode criar pedidos
      allow create: if request.auth != null;
      // Só admin pode atualizar pedidos
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. Clique em **"Publicar"** (Publish)

### 6️⃣ Copiar Credenciais para o Projeto

1. Volte para a página inicial do projeto Firebase
2. Clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto"
3. Clique em **"Configurações do projeto"**
4. Role até **"Seus apps"** e clique no app web que você criou
5. Copie as credenciais do `firebaseConfig`

### 7️⃣ Editar o Arquivo de Configuração

1. Abra o arquivo `src/firebase/config.ts` no seu projeto
2. Substitua os valores `YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, etc. pelas suas credenciais:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Cole aqui
  authDomain: "seu-projeto.firebaseapp.com", // Cole aqui
  projectId: "seu-projeto-id", // Cole aqui
  storageBucket: "seu-projeto.appspot.com", // Cole aqui
  messagingSenderId: "123456789", // Cole aqui
  appId: "1:123456789:web:abcdef" // Cole aqui
}
```

3. Salve o arquivo

✅ **Pronto! Firebase configurado!**

---

## 🎯 Criar Conta de Admin

Agora você precisa criar sua conta de admin:

### Opção A: Pela aplicação (recomendado)

1. Inicie o projeto: `npm run dev`
2. Acesse a tela de cadastro
3. Crie uma conta com seu email e senha
4. No Firebase Console, vá em **Firestore Database**
5. Você verá uma coleção `users` com seu usuário
6. Clique no documento do seu usuário
7. Adicione um campo:
   - **Campo**: `isAdmin`
   - **Tipo**: `boolean`
   - **Valor**: `true`
8. Clique em **Atualizar**

### Opção B: Criar manualmente no Firebase Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique em **Adicionar usuário** ou **Add user**
3. Digite seu email e uma senha
4. Clique em **Adicionar**
5. **IMPORTANTE**: Não crie um documento na coleção `users` para este usuário
6. Quando você fizer login, será automaticamente admin (porque não existe no Firestore)

---

## ✅ Verificar se está funcionando

1. Rode o projeto: `npm run dev`
2. Acesse `http://localhost:5173`
3. Faça login com sua conta admin
4. Você deve ver o botão **"Admin"** no menu superior

---

## 🔒 Segurança

⚠️ **Importante**: 
- As regras do Firestore estão configuradas, mas você pode ajustar conforme necessário
- Nunca compartilhe suas credenciais do Firebase publicamente
- Em produção, considere adicionar mais validações nas regras

---

## 📞 Precisa de ajuda?

Se tiver algum problema:
1. Verifique se copiou as credenciais corretas
2. Verifique se Authentication está ativado
3. Verifique se Firestore está criado e as regras estão publicadas
4. Verifique o console do navegador para erros

