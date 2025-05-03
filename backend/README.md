# Blitz Trades Backend API

## Configurazione

1. Installa le dipendenze:
   ```
   npm install
   ```

2. Configura il file `.env` (usa `.env.example` come modello):
   ```
   cp .env.example .env
   # Modifica il file .env con le tue configurazioni
   ```

3. Avvia il server in modalità sviluppo:
   ```
   npm run dev
   ```

## API Endpoints

### Autenticazione

- `POST /api/users/register` - Registrazione nuovo utente
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/users/login` - Login utente
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Token

- `GET /api/tokens/trending` - Ottieni token di tendenza
  - Query params: `blockchain`, `limit`, `offset`

- `GET /api/tokens/search` - Cerca token
  - Query params: `q` (query), `blockchain`, `limit`, `offset`

- `GET /api/tokens/:contractAddress` - Ottieni dettagli di un token
  - Query params: `blockchain`

- `GET /api/tokens/:contractAddress/security` - Analizza sicurezza di un token
  - Query params: `blockchain`

### Wallet

- `GET /api/wallets/:address/transactions` - Ottieni transazioni di un wallet
  - Query params: `blockchain`, `limit`

- `POST /api/wallets/track` - Aggiungi wallet ai monitorati (richiede autenticazione)
  ```json
  {
    "address": "0x123...abc",
    "blockchain": "ethereum",
    "label": "Whale 1",
    "isWhale": true,
    "isInfluencer": false
  }
  ```

- `GET /api/wallets/:address/stats` - Ottieni statistiche di un wallet
  - Query params: `blockchain`

- `GET /api/wallets/smart-money` - Ottieni wallet di "smart money"
  - Query params: `blockchain`, `category`, `limit`, `offset`

### Trading

- `GET /api/trading/bots` - Ottieni lista dei bot dell'utente (richiede autenticazione)

- `GET /api/trading/bots/:id` - Ottieni dettagli di un bot (richiede autenticazione)

- `POST /api/trading/bots` - Crea un nuovo bot (richiede autenticazione)
  ```json
  {
    "name": "My Sniper Bot",
    "type": "sniper",
    "blockchain": "solana",
    "walletAddress": "AaBb...",
    "config": {
      "sniperConfig": {
        "tokenAddress": "AaB...",
        "maxPrice": 0.001,
        "amount": 1
      },
      "generalConfig": {
        "slippage": 0.5,
        "gasMultiplier": 1.5,
        "antiMevEnabled": true
      }
    }
  }
  ```

- `POST /api/trading/bots/:id/stop` - Ferma un bot (richiede autenticazione)

- `POST /api/trading/bots/:id/start` - Avvia un bot (richiede autenticazione)

- `GET /api/trading/transactions` - Ottieni transazioni dell'utente (richiede autenticazione)
  - Query params: `limit`, `offset`, `status`, `type`, `blockchain`

- `POST /api/trading/execute` - Esegui una transazione manuale (richiede autenticazione)
  ```json
  {
    "tokenAddress": "0x123...",
    "blockchain": "ethereum",
    "type": "buy",
    "amount": 0.1,
    "walletAddress": "0xabc..."
  }
  ```

## Integrazione Blockchain

Per le funzionalità blockchain, è necessario:

1. Configurare RPC URL per Solana ed Ethereum nel file `.env`
2. Per Ethereum, registrarsi su Infura o Alchemy per ottenere una chiave API
3. Per Solana, il valore predefinito dovrebbe funzionare ma potrebbe avere limiti di rate