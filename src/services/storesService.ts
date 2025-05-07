// src/services/storesService.ts
import api from '../api/api';

export type Store = {
  storeID: string;
  storeName: string;
  isActive: number;
};

class StoresService {
  private stores: Store[] = [];
  private isLoading = false;

  async getStores(): Promise<Store[]> {
    if (this.stores.length > 0) {
      return this.stores;
    }

    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            resolve(this.stores);
          }
        }, 100);
      });
    }

    this.isLoading = true;

    try {
      // Tipagem explícita da resposta como Store[]
      const response = await api.get<Store[]>('/stores');
      this.stores = response.data;
      return this.stores;
    } catch (error) {
      console.error('Erro ao buscar as lojas:', error);
      return [
        { storeID: "1", storeName: "Steam", isActive: 1 },
        { storeID: "2", storeName: "GamersGate", isActive: 1 },
        { storeID: "3", storeName: "GreenManGaming", isActive: 1 },
        { storeID: "7", storeName: "GOG", isActive: 1 },
        { storeID: "8", storeName: "Origin", isActive: 1 },
        { storeID: "11", storeName: "Humble Store", isActive: 1 },
        { storeID: "13", storeName: "Uplay", isActive: 1 },
        { storeID: "15", storeName: "Fanatical", isActive: 1 },
        { storeID: "21", storeName: "WinGameStore", isActive: 1 },
        { storeID: "24", storeName: "Epic Games", isActive: 1 },
      ];
    } finally {
      this.isLoading = false;
    }
  }

  async getStoreName(storeID: number | string): Promise<string> {
    const stores = await this.getStores();
    const store = stores.find(s => s.storeID === storeID.toString());
    return store ? store.storeName : `Loja ${storeID}`;
  }
}

export const storesService = new StoresService();
export default storesService;
