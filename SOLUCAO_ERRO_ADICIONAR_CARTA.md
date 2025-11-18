# 🔧 Solução para Erro ao Adicionar Carta

Se você está recebendo o erro "Erro ao adicionar carta", siga estes passos:

## 🔍 Possíveis Causas e Soluções

### 1️⃣ **Permissão Negada (Mais Comum)**

**Erro**: `permission-denied`

**Solução**:

1. **Verifique se você é admin**:
   - No Firebase Console, vá em **Firestore Database**
   - Procure pela coleção `users`
   - Encontre o documento com seu `uid` (ID do usuário)
   - Verifique se existe o campo `isAdmin` com valor `true`

2. **Se não existir, adicione**:
   - Clique no documento do seu usuário
   - Clique em **"Adicionar campo"** (Add field)
   - **Nome do campo**: `isAdmin`
   - **Tipo**: `boolean`
   - **Valor**: `true`
   - Clique em **"Atualizar"**

3. **Verifique as regras do Firestore**:
   - No Firebase Console, vá em **Firestore Database** → **Regras**
   - Certifique-se de que as regras estão assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    // ... resto das regras
  }
}
```

4. **Faça logout e login novamente**:
   - No site, clique em "Sair"
   - Faça login novamente
   - Tente adicionar a carta novamente

---

### 2️⃣ **Usuário Não Autenticado**

**Erro**: `unauthenticated`

**Solução**:
- Certifique-se de estar logado
- Faça logout e login novamente
- Verifique se o Firebase Authentication está ativado

---

### 3️⃣ **Campos Não Preenchidos**

**Erro**: Mensagens específicas sobre campos faltando

**Solução**:
- Preencha **TODOS** os campos obrigatórios:
  - ✅ Nome da Carta
  - ✅ Preço (R$)
  - ✅ Quantidade em Estoque
- Descrição e URL da Imagem são opcionais, mas recomendados

---

### 4️⃣ **Valores Inválidos**

**Erro**: Mensagens sobre valores inválidos

**Solução**:
- **Preço**: Deve ser um número maior que zero (ex: `10.50`)
- **Quantidade**: Deve ser um número inteiro maior ou igual a zero (ex: `5`)

---

### 5️⃣ **Problema de Conexão**

**Erro**: `unavailable` ou timeout

**Solução**:
- Verifique sua conexão com a internet
- Recarregue a página (F5)
- Tente novamente após alguns segundos

---

## 🧪 Como Verificar se Está Funcionando

1. **Abra o Console do Navegador**:
   - Pressione `F12` no navegador
   - Vá na aba **"Console"**

2. **Tente adicionar uma carta novamente**

3. **Veja a mensagem de erro completa**:
   - A mensagem mostrará o código de erro específico
   - Isso ajudará a identificar o problema exato

---

## ✅ Checklist de Verificação

Antes de tentar adicionar uma carta, certifique-se de que:

- [ ] Você está logado
- [ ] Você é administrador (`isAdmin: true` no Firestore)
- [ ] As regras do Firestore estão configuradas corretamente
- [ ] Todos os campos obrigatórios estão preenchidos
- [ ] Os valores numéricos são válidos
- [ ] Você tem conexão com a internet
- [ ] O Firebase está configurado corretamente

---

## 📞 Se Nada Funcionar

1. **Verifique o console do navegador** (F12) para erros detalhados
2. **Verifique o Firebase Console** para ver se há erros de regras
3. **Tente fazer logout e login novamente**
4. **Verifique se o Firestore está ativo e funcionando**

---

## 💡 Dica Rápida

O erro mais comum é **permissão negada**. Certifique-se de que:
1. Você tem `isAdmin: true` no Firestore
2. Fez logout e login novamente após configurar

