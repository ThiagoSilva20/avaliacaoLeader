// src/interfaces.ts
export interface Deal {
  id?: string;
  dealID?: string;
  title: string;
  storeID: number;
  salePrice: number | string;
  normalPrice: number | string;
  savings: number;
  dealRating: number;
  thumb?: string;
  // Campos opcionais que podem ser usados pelo modal
  steamRatingText?: string;
  steamRatingPercent?: number;
  steamAppID?: string;
  releaseDate?: number;
  lastChange?: number;
}
  
  export interface Store {
    storeID: string;
    storeName: string;
    isActive: number;
    images: {
      banner: string;
      logo: string;
      icon: string;
    };
  }
  
  export interface FilterParams {
    searchTerm: string;
    storeID: string;
    lowerPrice: number;
    upperPrice: number;
    minDiscount: number;
    sortBy: SortOption;
  }
  
  export type SortOption = 'dealRating' | 'price' | 'savings' | 'title';
  
  export interface FilterChangeHandler {
    onSearchChange: (value: string) => void;
    onStoreChange: (value: string) => void;
    onPriceRangeChange: (value: [number, number]) => void;
    onDiscountChange: (value: number) => void;
    onSortChange: (value: SortOption) => void;
    onResetFilters: () => void;
  }