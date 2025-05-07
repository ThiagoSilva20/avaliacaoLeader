// src/App.tsx
import { useEffect, useState, useCallback } from 'react';
import api from './api/api';
import { type Deal, type FilterParams, type SortOption } from './interfaces';
import FiltersPanel from './components/FiltersPanel';
import DealsTable from './components/DealsTable';

function App() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado dos filtros
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    storeID: '',
    lowerPrice: 0,
    upperPrice: 100,
    minDiscount: 0,
    sortBy: 'dealRating'
  });

  // Buscar ofertas da API
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await api.get('/deals');
        setDeals(response.data);
      } catch (error) {
        console.error('Erro ao buscar deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Aplicar filtros aos dados sempre que os filtros ou dados mudarem
  useEffect(() => {
    if (!Array.isArray(deals)) return;
    
    let filtered = [...deals];

    // Filtro de texto por título
    if (filters.searchTerm) {
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtro por loja
    if (filters.storeID) {
      filtered = filtered.filter(deal => deal.storeID.toString() === filters.storeID);
    }

    // Filtro por faixa de preço
    filtered = filtered.filter(
      deal => 
        Number(deal.salePrice) >= filters.lowerPrice && 
        Number(deal.salePrice) <= filters.upperPrice
    );

    // Filtro por desconto mínimo
    filtered = filtered.filter(deal => 
      parseFloat(deal.savings.toString()) >= filters.minDiscount
    );

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return Number(a.salePrice) - Number(b.salePrice);
        case 'savings':
          return parseFloat(b.savings.toString()) - parseFloat(a.savings.toString());
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dealRating':
        default:
          return Number(b.dealRating) - Number(a.dealRating);
      }
    });

    setFilteredDeals(filtered);
  }, [deals, filters]);

  // Handlers para mudanças nos filtros
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  }, []);

  const handleStoreChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, storeID: value }));
  }, []);

  const handlePriceRangeChange = useCallback((value: [number, number]) => {
    setFilters(prev => ({ ...prev, lowerPrice: value[0], upperPrice: value[1] }));
  }, []);

  const handleDiscountChange = useCallback((value: number) => {
    setFilters(prev => ({ ...prev, minDiscount: value }));
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      storeID: '',
      lowerPrice: 0,
      upperPrice: 100,
      minDiscount: 0,
      sortBy: 'dealRating'
    });
  }, []);

  const filterHandlers = {
    onSearchChange: handleSearchChange,
    onStoreChange: handleStoreChange,
    onPriceRangeChange: handlePriceRangeChange,
    onDiscountChange: handleDiscountChange,
    onSortChange: handleSortChange,
    onResetFilters: resetFilters
  };

  return (
    <div className="flex align-center justify-center min-h-screen bg-gray-800">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Ofertas de Jogos</h1>
        
        {/* Painel de Filtros */}
        <FiltersPanel 
          filters={filters} 
          onChange={filterHandlers} 
        />
        
        {/* Tabela de Dados */}
        <DealsTable 
          deals={filteredDeals} 
          loading={loading} 
        />
      </div>
    </div>
  );
}

export default App;