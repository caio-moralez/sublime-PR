# Sublime - realtime Paint Room

Aplicação de desenho colaborativo em tempo real utilizando **React**, **Fabric.js** e **Socket.IO**. Usuários entram em uma sala através de um código e podem desenhar simultaneamente em um mesmo canvas, com sincronização instantânea entre todos os clientes conectados.

O projeto foi pensado para funcionar tanto no navegador quanto empacotado como aplicação desktop via **Electron**.

---

## Visão Geral

* O usuário informa um **código de sala**
* Ao entrar, é conectado a uma sala via **WebSocket (Socket.IO)**
* Todos os desenhos feitos no canvas são enviados ao servidor
* O servidor retransmite os desenhos para os outros usuários da mesma sala
* Existe sincronização de limpeza do canvas (Clear)

---

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* Fabric.js
* Socket.IO Client

### Backend

* Node.js
* Express
* Socket.IO

### Desktop (opcional)

* Electron

---

## Estrutura do Projeto

```
root
│
├── server
│   └── index.js        # Servidor Socket.IO
│
├── src
│   ├── components
│   │   └── PaintRoom.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
└── package.json
```

---

## Funcionamento do Frontend

### App.jsx

Responsável por:

* Criar a conexão Socket.IO
* Controlar o estado da sala
* Exibir a tela de entrada
* Renderizar o PaintRoom após entrar na sala

Fluxo:

1. Usuário digita o código da sala
2. App emite `join-room` para o servidor
3. Estado `joined` muda para `true`
4. O componente PaintRoom é renderizado

---

### PaintRoom.jsx

Responsável por:

* Criar o canvas com Fabric.js
* Controlar cor e espessura do pincel
* Enviar desenhos via WebSocket
* Receber desenhos remotos
* Limpar o canvas local e remoto

Eventos principais:

* `path:created` → envia o desenho para o servidor
* `drawing` → recebe desenho de outros usuários
* `clear-canvas` → limpa o canvas sincronizadamente

---

## Funcionamento do Backend

O servidor mantém um controle simples das salas:

```js
rooms = {
  roomCode: [socketId, socketId]
}
```

### Eventos Socket.IO

* `join-room`

  * Adiciona o socket à sala
  * Emite a lista atualizada de usuários

* `drawing`

  * Recebe um path do Fabric.js
  * Reenvia para os outros sockets da sala

* `clear-canvas`

  * Limpa o canvas de todos na sala

* `disconnect`

  * Remove o socket das salas
  * Atualiza usuários conectados

---

## Como Rodar Localmente

### Backend

```bash
cd server
npm install
node index.js
```

Servidor inicia em:

```
http://localhost:4000
```

---

### Frontend

```bash
npm install
npm run dev
```

Frontend inicia em:

```
http://localhost:5173
```

---

## Uso com Electron

O Electron pode carregar:

* A URL do frontend (modo desenvolvimento)
* Ou os arquivos buildados do React (produção)

Recomendado para produção:

```bash
npm run build
```

E carregar o `index.html` gerado no Electron.


---

## Limitações Atuais

* Não há persistência dos desenhos
* Salas são mantidas apenas em memória
* Se o servidor reiniciar, as salas são perdidas

---

## Possíveis Melhorias

* Persistir desenhos no backend
* Sistema de autenticação
* Histórico da sala
* Suporte a múltiplas páginas de desenho
* Chat em tempo real

---

## Autor

Nome: *Caio Moralez*

---

## Licença

Projeto de uso livre para fins educacionais e experimentais.
