import { configureStore, createSlice } from "@reduxjs/toolkit";
import { openDB } from "idb";

// Initialize IndexedDB
const dbPromise = openDB("pwa_stocks", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("stocks")) {
      db
      .createObjectStore("stocks", { keyPath: "id", autoIncrement: true })
      .createIndex("symbol", "symbol", { unique: true });
    }
    if (!db.objectStoreNames.contains("history")) {
      db.createObjectStore("history", { keyPath: "id"})
      .createIndex("symbol", "symbol");
    }
  },
});

// Interface for the DB stocks
export interface StockDB {
  id: number;
  symbol: string;
  value: number;
  name: string; // Added name to the stock
}

// Interface for the DB history
export interface HistoryDB {
  timestamp: number;
  symbol: string;
  price: number;
  volume: number;
}

// Auxiliary functions for IndexedDB
const idbSetStock = async (storeName: string, value: StockDB) => {
  const db = await dbPromise;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  const existingStock = await store.get(value.symbol);
  if (!existingStock) {
    await store.put(value);
  } else {
    alert("This stock has already been added before.");
  }
  await tx.done;
};

const idbSetHistory = async (storeName: string, value: HistoryDB) => {
  const db = await dbPromise;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.put(value);
  await tx.done;
};

const idbGetAll = async (storeName: string) => {
  const db = await dbPromise;
  return db.getAll(storeName);
};

const idbGetBySymbol = async (storeName: string, symbol: string) => {
  const db = await dbPromise;
  return db.getAllFromIndex(storeName, "symbol", symbol);
};

// Stocks Slice
const stocksSlice = createSlice({
  name: "stocks",
  initialState: [] as StockDB[],
  reducers: {
    setStocks: (state, action) => action.payload,
    addStock: (state, action) => {
      const existingStock = state.find(stock => stock.symbol === action.payload.symbol);
      if (!existingStock) {
        state.push(action.payload);
        idbSetStock("stocks", action.payload);
      } else {
        alert("This stock has already been added before.");
      }
    },
    removeStockBySymbol: (state, action) => {
      state = state.filter(stock => stock.symbol !== action.payload);
      idbGetBySymbol("stocks", action.payload).then(stocks => {
        stocks.forEach(stock => {
          dbPromise.then(db => {
            const tx = db.transaction("stocks", "readwrite");
            tx.objectStore("stocks").delete(stock.id);
            return tx.done;
          });
        });
      });
      return state;
    },
  },
});

// History Slice
const historySlice = createSlice({
  name: "history",
  initialState: [],
  reducers: {
    setHistory: (state: any, action) => action.payload,
    addHistory: (state, action) => {
      if (!state.some((historyItem: HistoryDB) => historyItem.timestamp === action.payload.timestamp)) {
        state.push(action.payload);
      }
      idbSetHistory("history", action.payload);
    },
  },
});

// Store
const store = configureStore({
  reducer: {
    stocks: stocksSlice.reducer,
    history: historySlice.reducer,
  },
});

// Load initial data from IndexedDB
(async () => {
  const stocks = await idbGetAll("stocks");
  const history = await idbGetAll("history");

  store.dispatch(stocksSlice.actions.setStocks(stocks));
  store.dispatch(historySlice.actions.setHistory(history));
})();

export const { addStock, setStocks, removeStockBySymbol } = stocksSlice.actions;
export const { addHistory, setHistory } = historySlice.actions;

export default store;
