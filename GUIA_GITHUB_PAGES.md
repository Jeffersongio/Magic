# 🚀 Guia de Deploy para GitHub Pages

Este guia vai te ajudar a colocar seu site "Cartinhas do Jef" no ar usando GitHub Pages.

## 📋 Pré-requisitos

1. Conta no GitHub (se não tiver, crie em [github.com](https://github.com))
2. Git instalado no seu computador
3. O projeto configurado e funcionando localmente

---

## 🔧 Passo 1: Configurar o Git (se ainda não fez)

Abra o terminal na pasta do projeto (`C:\Users\jeffe\Documents\Magic`) e execute:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 📦 Passo 2: Inicializar o Repositório Git

1. Abra o terminal na pasta do projeto
2. Execute os seguintes comandos:

```bash
# Inicializar o Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: Cartinhas do Jef"
```

---

## 🌐 Passo 3: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `Magic` (ou outro nome que preferir)
   - **Description**: "Cartinhas do Jef - Loja de cartas Magic: The Gathering"
   - **Visibility**: Público (Public) ou Privado (Private)
   - ⚠️ **NÃO marque** "Initialize this repository with a README"
5. Clique em **"Create repository"**

---

## 🔗 Passo 4: Conectar ao GitHub

No terminal, execute (substitua `SEU_USUARIO` pelo seu usuário do GitHub):

```bash
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/Magic.git

# Renomear a branch para 'main' (se necessário)
git branch -M main

# Enviar o código para o GitHub
git push -u origin main
```

Se pedir autenticação, você precisará:
- Usar um Personal Access Token (PAT) ao invés de senha
- Ou configurar SSH keys

### Como criar Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Dê um nome e marque `repo` como permissão
4. Gere e **COPIE** o token (você só verá uma vez!)
5. Use o token como senha ao fazer push

---

## ⚙️ Passo 5: Configurar GitHub Pages

### Opção A: Deploy Automático (Recomendado)

1. No repositório GitHub, vá em **Settings** (Configurações)
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **"GitHub Actions"**
4. Pronto! O workflow vai fazer o deploy automaticamente quando você fizer push

### Opção B: Deploy Manual (Alternativo)

1. No repositório GitHub, vá em **Settings** → **Pages**
2. Em **Source**, selecione **"Deploy from a branch"**
3. Selecione a branch **main** e pasta **/ (root)**
4. Clique em **Save**

Depois, você precisa fazer o build e enviar a pasta `dist`:
```bash
npm run build
git add dist
git commit -m "Build for GitHub Pages"
git push
```

---

## 🔄 Passo 6: Ajustar Base Path (IMPORTANTE)

Se o repositório for `https://github.com/usuario/Magic`, o site estará em:
`https://usuario.github.io/Magic/`

O arquivo `vite.config.ts` já está configurado com `base: '/Magic/'`.

**Se o nome do repositório for diferente**, edite o arquivo `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/NOME_DO_REPO/' : '/',
```

**Se for uma user page** (`https://usuario.github.io`), use:
```typescript
base: '/',
```

---

## ✅ Passo 7: Primeiro Deploy

1. **Faça uma pequena alteração** (ou apenas um commit vazio) para acionar o workflow:

```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push
```

2. Vá em **Actions** no repositório GitHub
3. Você verá o workflow rodando
4. Aguarde alguns minutos (primeira vez pode demorar mais)

---

## 🌍 Passo 8: Acessar seu Site

Após o deploy completar:

1. Vá em **Settings** → **Pages**
2. Você verá a URL do seu site:
   - `https://SEU_USUARIO.github.io/Magic/`
3. Clique no link para acessar!

**Nota**: Pode levar alguns minutos para o site ficar disponível na primeira vez.

---

## 🔄 Próximos Deploys

A partir de agora, sempre que você:

1. Fizer alterações no código
2. Fizer commit e push:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

O GitHub Actions vai fazer o deploy automaticamente! 🎉

---

## ⚠️ Importante: Configurar Firebase

Como o site vai rodar em `https://usuario.github.io/Magic/`, você precisa:

### 1. Adicionar Domínio no Firebase

1. No Firebase Console, vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione: `usuario.github.io`
3. Clique em **Add**

### 2. Verificar Firestore Rules

As regras do Firestore já estão configuradas corretamente. Apenas certifique-se de que estão publicadas.

---

## 🐛 Solução de Problemas

### Site não está aparecendo
- Aguarde 5-10 minutos (primeira vez pode demorar)
- Verifique se o workflow completou sem erros em **Actions**
- Verifique se o domínio está correto no `vite.config.ts`

### Erro 404
- Verifique se o `base` no `vite.config.ts` está correto
- Certifique-se de que o workflow fez o build corretamente

### Firebase não funciona
- Verifique se adicionou `usuario.github.io` nos domínios autorizados do Firebase
- Verifique se as credenciais do Firebase estão corretas no código

### Build falha
- Verifique se todos os arquivos estão commitados
- Veja os logs em **Actions** para ver o erro específico

---

## 📝 Comandos Git Úteis

```bash
# Ver status dos arquivos
git status

# Adicionar arquivos
git add .
git add nome-do-arquivo

# Fazer commit
git commit -m "Mensagem descritiva"

# Enviar para GitHub
git push

# Ver histórico
git log

# Criar nova branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main
```

---

## 🎉 Pronto!

Seu site "Cartinhas do Jef" agora está no ar e será atualizado automaticamente sempre que você fizer push!

**URL do site**: `https://SEU_USUARIO.github.io/Magic/`

---

## 💡 Dica

Para usar um domínio personalizado:
1. Vá em **Settings** → **Pages**
2. Em **Custom domain**, adicione seu domínio
3. Siga as instruções para configurar o DNS

