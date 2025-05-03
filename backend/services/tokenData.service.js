const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');
const Web3 = require('web3');
const config = require('../config/config');

// ERC20 ABI per interagire con token Ethereum
const ERC20_ABI = [
  // Solo le funzioni necessarie per leggere informazioni di base
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * TokenData service per recuperare dati sui token dalle blockchain
 */
class TokenDataService {
  constructor() {
    // Inizializza connessioni blockchain
    this.solanaConnection = new Connection(config.blockchain.solana.rpcUrl);
    this.ethereumWeb3 = new Web3(config.blockchain.ethereum.rpcUrl);
    
    // Cache per dati token recenti
    this.tokenCache = new Map();
    // Durata cache in ms (30 minuti)
    this.cacheDuration = 30 * 60 * 1000;
  }

  /**
   * Recupera dati di base di un token
   * @param {string} contractAddress - Indirizzo del contratto token
   * @param {string} blockchain - Blockchain (ethereum, solana)
   */
  async getTokenBasicInfo(contractAddress, blockchain) {
    // Check cache first
    const cacheKey = `${blockchain}:${contractAddress}:basic`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      let tokenInfo;
      
      if (blockchain === 'ethereum') {
        tokenInfo = await this.getERC20TokenInfo(contractAddress);
      } else if (blockchain === 'solana') {
        tokenInfo = await this.getSPLTokenInfo(contractAddress);
      } else {
        throw new Error(`Blockchain non supportata: ${blockchain}`);
      }
      
      // Cache the data
      this.cacheData(cacheKey, tokenInfo);
      
      return tokenInfo;
    } catch (error) {
      console.error(`Errore nel recupero dei dati del token ${contractAddress}:`, error);
      throw error;
    }
  }

  /**
   * Recupera informazioni su un token ERC20 (Ethereum)
   * @param {string} contractAddress - Indirizzo del contratto ERC20
   */
  async getERC20TokenInfo(contractAddress) {
    try {
      // Verifica che l'indirizzo sia valido
      if (!this.ethereumWeb3.utils.isAddress(contractAddress)) {
        throw new Error('Indirizzo Ethereum non valido');
      }

      // Istanzia il contratto ERC20
      const tokenContract = new this.ethereumWeb3.eth.Contract(ERC20_ABI, contractAddress);
      
      // Recupera dati di base
      const [name, symbol, decimalsStr, totalSupplyWei] = await Promise.all([
        tokenContract.methods.name().call().catch(() => 'Unknown'),
        tokenContract.methods.symbol().call().catch(() => 'UNKNOWN'),
        tokenContract.methods.decimals().call().catch(() => '18'),
        tokenContract.methods.totalSupply().call().catch(() => '0')
      ]);
      
      // Converti i dati
      const decimals = parseInt(decimalsStr, 10);
      const totalSupply = this.ethereumWeb3.utils.fromWei(
        totalSupplyWei, 
        decimals === 18 ? 'ether' : 'wei'
      );
      
      // In un'implementazione reale, qui recupereresti i dati di mercato da API come CoinGecko
      // o DEX come Uniswap
      
      return {
        name,
        symbol,
        contractAddress,
        blockchain: 'ethereum',
        decimals,
        totalSupply,
        // Placeholder per dati di mercato
        marketData: {
          price: null,
          marketCap: null,
          volume24h: null,
          priceChange24h: null,
          holders: null,
          lastUpdated: new Date()
        }
      };
    } catch (error) {
      console.error(`Errore nel recupero dei dati del token ERC20 ${contractAddress}:`, error);
      throw error;
    }
  }

  /**
   * Recupera informazioni su un token SPL (Solana)
   * @param {string} tokenAddress - Indirizzo del token SPL
   */
  async getSPLTokenInfo(tokenAddress) {
    try {
      // Verifica che l'indirizzo sia valido
      let mintPubkey;
      try {
        mintPubkey = new PublicKey(tokenAddress);
      } catch (error) {
        throw new Error('Indirizzo Solana non valido');
      }

      // In un'implementazione reale, qui utilizzeresti @solana/spl-token per ottenere
      // i dettagli del token. Questa è una versione semplificata.
      
      // Per ora, simuliamo il recupero dei dati del token
      // In un'implementazione reale, questi dati verrebbero dalla blockchain
      
      return {
        name: 'Solana Token',
        symbol: 'SPL',
        contractAddress: tokenAddress,
        blockchain: 'solana',
        decimals: 9,
        totalSupply: '1000000000',
        // Placeholder per dati di mercato
        marketData: {
          price: null,
          marketCap: null,
          volume24h: null,
          priceChange24h: null,
          holders: null,
          lastUpdated: new Date()
        }
      };
    } catch (error) {
      console.error(`Errore nel recupero dei dati del token SPL ${tokenAddress}:`, error);
      throw error;
    }
  }

  /**
   * Ottiene dati di mercato per un token da API esterne
   * @param {string} contractAddress - Indirizzo del contratto token
   * @param {string} blockchain - Blockchain (ethereum, solana)
   */
  async getTokenMarketData(contractAddress, blockchain) {
    // Check cache first
    const cacheKey = `${blockchain}:${contractAddress}:market`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      // In un'implementazione reale, qui faresti una chiamata API a CoinGecko, CoinMarketCap
      // o un'API aggregatore di DEX come 0x o 1inch
      
      // Esempio di dati di mercato simulati
      const marketData = {
        price: Math.random() * 0.01, // Prezzo casuale per simulazione
        marketCap: Math.random() * 1000000,
        volume24h: Math.random() * 500000,
        priceChange24h: (Math.random() * 20) - 10, // Variazione tra -10% e +10%
        liquidityUSD: Math.random() * 100000,
        holders: Math.floor(Math.random() * 1000),
        lastUpdated: new Date()
      };
      
      // Cache the data
      this.cacheData(cacheKey, marketData);
      
      return marketData;
    } catch (error) {
      console.error(`Errore nel recupero dei dati di mercato per ${contractAddress}:`, error);
      throw error;
    }
  }

  /**
   * Ottiene token di tendenza
   * @param {string} blockchain - Blockchain (ethereum, solana, o null per tutti)
   * @param {number} limit - Numero massimo di token da restituire
   */
  async getTrendingTokens(blockchain = null, limit = 10) {
    try {
      // In un'implementazione reale, qui faresti una chiamata API a CoinGecko, CoinMarketCap
      // o DEX specifici della blockchain per ottenere i token trending
      
      // Esempio di dati simulati
      const trendingTokens = [
        {
          name: 'PepeCoin',
          symbol: 'PEPE',
          contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
          blockchain: 'ethereum',
          marketData: {
            price: 0.000001234,
            priceChange24h: 15.6,
            volume24h: 4500000
          }
        },
        {
          name: 'Solana Doge',
          symbol: 'SDOGE',
          contractAddress: 'DogE1kQQDQQ3sUu4sXVajnTQSLJG8UKnw8qmWcSJMxCZ',
          blockchain: 'solana',
          marketData: {
            price: 0.00567,
            priceChange24h: 45.7,
            volume24h: 2300000
          }
        },
        {
          name: 'MoonShot',
          symbol: 'MOON',
          contractAddress: '0x6c6bc977e13df9b0de53b251522280bb72383700',
          blockchain: 'ethereum',
          marketData: {
            price: 0.000789,
            priceChange24h: 8.9,
            volume24h: 1700000
          }
        },
        {
          name: 'Floki Inu',
          symbol: 'FLOKI',
          contractAddress: '0x43f11c02439e2736800433b4594994bd43cd066d',
          blockchain: 'ethereum',
          marketData: {
            price: 0.000158,
            priceChange24h: 3.2,
            volume24h: 9800000
          }
        },
        {
          name: 'Bonk',
          symbol: 'BONK',
          contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          blockchain: 'solana',
          marketData: {
            price: 0.00000279,
            priceChange24h: 12.3,
            volume24h: 7600000
          }
        }
      ];
      
      // Filtra per blockchain se specificata
      let filteredTokens = trendingTokens;
      if (blockchain) {
        filteredTokens = trendingTokens.filter(token => token.blockchain === blockchain);
      }
      
      // Limita il numero di risultati
      return filteredTokens.slice(0, limit);
    } catch (error) {
      console.error('Errore nel recupero dei token di tendenza:', error);
      throw error;
    }
  }

  /**
   * Cerca token per nome o simbolo
   * @param {string} query - Stringa di ricerca (nome o simbolo)
   * @param {string} blockchain - Blockchain (ethereum, solana, o null per tutti)
   * @param {number} limit - Numero massimo di token da restituire
   */
  async searchTokens(query, blockchain = null, limit = 10) {
    try {
      // In un'implementazione reale, qui faresti una chiamata API a un servizio
      // che offre funzionalità di ricerca per token
      
      // Esempio di dati simulati
      const allTokens = [
        {
          name: 'PepeCoin',
          symbol: 'PEPE',
          contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
          blockchain: 'ethereum',
          marketData: {
            price: 0.000001234,
            priceChange24h: 15.6
          }
        },
        {
          name: 'Shiba Inu',
          symbol: 'SHIB',
          contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          blockchain: 'ethereum',
          marketData: {
            price: 0.0000082,
            priceChange24h: -2.3
          }
        },
        {
          name: 'Solana Doge',
          symbol: 'SDOGE',
          contractAddress: 'DogE1kQQDQQ3sUu4sXVajnTQSLJG8UKnw8qmWcSJMxCZ',
          blockchain: 'solana',
          marketData: {
            price: 0.00567,
            priceChange24h: 45.7
          }
        },
        {
          name: 'Dogecoin',
          symbol: 'DOGE',
          contractAddress: '0x4206931337dc273a630d328da6441786bfad668f', // Indirizzo esempio
          blockchain: 'ethereum',
          marketData: {
            price: 0.123,
            priceChange24h: -2.3
          }
        },
        {
          name: 'BonkCoin',
          symbol: 'BONK',
          contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          blockchain: 'solana',
          marketData: {
            price: 0.00000279,
            priceChange24h: 12.3
          }
        }
      ];
      
      // Filtra per query
      const queryLower = query.toLowerCase();
      let filteredTokens = allTokens.filter(token => 
        token.name.toLowerCase().includes(queryLower) || 
        token.symbol.toLowerCase().includes(queryLower)
      );
      
      // Filtra per blockchain se specificata
      if (blockchain) {
        filteredTokens = filteredTokens.filter(token => token.blockchain === blockchain);
      }
      
      // Limita il numero di risultati
      return filteredTokens.slice(0, limit);
    } catch (error) {
      console.error('Errore nella ricerca dei token:', error);
      throw error;
    }
  }

  /**
   * Recupera dati dalla cache
   * @param {string} key - Chiave cache
   */
  getCachedData(key) {
    if (this.tokenCache.has(key)) {
      const { data, timestamp } = this.tokenCache.get(key);
      if (Date.now() - timestamp < this.cacheDuration) {
        return data;
      }
      // Cache expired, remove it
      this.tokenCache.delete(key);
    }
    return null;
  }

  /**
   * Salva dati nella cache
   * @param {string} key - Chiave cache
   * @param {any} data - Dati da salvare
   */
  cacheData(key, data) {
    this.tokenCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

module.exports = new TokenDataService();