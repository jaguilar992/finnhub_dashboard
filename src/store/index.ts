import { configureStore, createSlice } from "@reduxjs/toolkit";
import { openDB } from "idb";

// Inicializar IndexedDB
const dbPromise = openDB("pwa-stocks", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("stocks")) {
      db.createObjectStore("stocks", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("stocks").createIndex("symbol", "symbol", { unique: true });
    }
    if (!db.objectStoreNames.contains("history")) {
      db.createObjectStore("history", { keyPath: "id" });
    }
  },
});

// Interfaz para la DB stocks
interface StockDB {
  id: number;
  symbol: string;
  value: number;
  name: string; // Agregado nombre al stock
}

// Funciones auxiliares para IndexedDB
const idbSet = async (storeName: string, value: StockDB) => {
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
        idbSet("stocks", action.payload);
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
    setHistory: (state, action) => action.payload,
    addHistory: (state, action) => {
      state.push(action.payload);
      idbSet("history", action.payload);
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

// Cargar datos iniciales desde IndexedDB
(async () => {
  const stocks = await idbGetAll("stocks");
  const history = await idbGetAll("history");

  store.dispatch(stocksSlice.actions.setStocks(stocks));
  store.dispatch(historySlice.actions.setHistory(history));
})();

export const { addStock, setStocks } = stocksSlice.actions;
export const { addHistory, setHistory } = historySlice.actions;

export default store;
