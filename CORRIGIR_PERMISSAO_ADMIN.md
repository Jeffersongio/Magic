# 🔧 Como Corrigir Permissão Negada - Passo a Passo

## ✅ Solução Rápida (5 minutos)

### Passo 1: Encontrar seu UID (ID do Usuário)

1. No Firebase Console, vá em **Authentication**
2. Clique na aba **Users** (Usuários)
3. Você verá uma lista de usuários
4. **COPIE o UID** do seu usuário (é uma string longa, tipo: `abc123xyz456...`)

---

### Passo 2: Criar/Editar seu Documento no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **"Iniciar coleção"** ou **"Start collection"** (se ainda não existir)

   **OU**

   Se a coleção `users` já existe, clique nela

3. Se for criar:
   - **ID da coleção**: `users` (exatamente assim, em minúsculas)
   - Clique em **"Próximo"** (Next)
   - **ID do documento**: Cole aqui o **UID** que você copiou no Passo 1
   - Clique em **"Próximo"**

4. Agora adicione os campos:

   **Campo 1:**
   - **Nome do campo**: `email`
   - **Tipo**: `string`
   - **Valor**: Seu email (ex: `seu@email.com`)
   - Clique em **"Adicionar campo"**

   **Campo 2:**
   - **Nome do campo**: `isAdmin`
   - **Tipo**: `boolean` (ou `boolean`)
   - **Valor**: `true` (marque a caixa ou digite `true`)
   - Clique em **"Salvar"**

5. **IMPORTANTE**: O documento deve ficar assim:

```
users (coleção)
  └── SEU_UID_AQUI (documento)
      ├── email: "seu@email.com"
      └── isAdmin: true
```

---

### Passo 3: Verificar as Regras do Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **"Regras"** (Rules)
3. Verifique se as regras estão assim:

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

4. Se não estiver assim, **COPIE e COLE** as regras acima
5. Clique em **"Publicar"** (Publish)

---

### Passo 4: Fazer Logout e Login Novamente

1. No site, clique em **"Sair"** (Logout)
2. Faça **login novamente**
3. Isso atualiza suas permissões

---

### Passo 5: Testar

1. Vá para o painel Admin (`/admin`)
2. Tente adicionar uma carta
3. Deve funcionar! ✅

---

## 🔍 Se Ainda Não Funcionar

### Verificar se o Documento Foi Criado Corretamente

1. No Firestore, vá em `users`
2. Verifique se existe um documento com seu UID
3. Abra o documento
4. Verifique se tem:
   - ✅ Campo `email` (string)
   - ✅ Campo `isAdmin` (boolean) com valor `true`

### Verificar se as Regras Estão Publicadas

1. No Firestore → Regras
2. Certifique-se de que clicou em **"Publicar"**
3. Deve mostrar "Publicado" ou "Published"

### Verificar o Console do Navegador

1. Pressione `F12` no navegador
2. Vá na aba **Console**
3. Tente adicionar a carta
4. Veja se há erros específicos

---

## 📸 Exemplo Visual

Seu Firestore deve estar assim:

```
📁 Firestore Database
  ├── 📁 cards
  │   └── (suas cartas aqui)
  ├── 📁 users  ⭐ IMPORTANTE!
  │   └── 📄 abc123xyz456... (seu UID)
  │       ├── email: "seu@email.com"
  │       └── isAdmin: true  ⭐ ESSENCIAL!
  └── 📁 orders
      └── (pedidos aqui)
```

---

## ⚠️ Erro Comum

**Não adicione o campo `isAdmin` como string!**
- ❌ ERRADO: `isAdmin: "true"` (string)
- ✅ CORRETO: `isAdmin: true` (boolean)

O tipo deve ser **boolean**, não **string**.

---

## 🎯 Resumo Rápido

1. Pegue seu UID no Firebase Authentication
2. Crie documento em `users` com seu UID
3. Adicione `email` (string) e `isAdmin: true` (boolean)
4. Verifique/Atualize as regras do Firestore
5. Faça logout e login novamente
6. Teste adicionar uma carta

Pronto! Deve funcionar! 🎉

