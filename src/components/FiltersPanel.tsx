import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Store, type FilterParams, type SortOption, type FilterChangeHandler } from '../interfaces';
import storesService from '../services/storesService';

interface FiltersPanelProps {
  filters: FilterParams;
  onChange: FilterChangeHandler;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storeData = await storesService.getStores();
        setStores((storeData as Store[]).filter(store => store.isActive === 1));
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <Card className="mb-6 p-4 sm:p-6 sm:max-w-300 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Filtros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Busca por título */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-800">Buscar por título</label>
            <Input
              placeholder="Digite o nome do jogo..."
              value={filters.searchTerm}
              onChange={(e) => onChange.onSearchChange(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] text-gray-900 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Filtro por loja */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-800">Loja</label>
            <Select 
              value={filters.storeID || 'all'} 
              onValueChange={(value) => onChange.onStoreChange(value === 'all' ? '' : value)}
              disabled={loading}
            >
              <SelectTrigger className={`border-gray-300 m-auto text-gray-900 text-sm sm:text-base ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}>
                <SelectValue placeholder={loading ? "Carregando..." : "Todas as lojas"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all" className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">Todas as lojas</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.storeID} value={store.storeID} className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">
                    {store.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenação */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-800">Ordenar por</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onChange.onSortChange(value as SortOption)}
            >
              <SelectTrigger className="border-gray-300 m-auto text-gray-900 bg-white text-sm sm:text-base">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="dealRating" className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">Melhor avaliação</SelectItem>
                <SelectItem value="price" className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">Menor preço</SelectItem>
                <SelectItem value="savings" className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">Maior desconto</SelectItem>
                <SelectItem value="title" className="text-gray-900 hover:bg-[#8B5CF6] hover:text-white text-sm sm:text-base">Nome do jogo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de reset */}
          <div className="flex items-end">
            <Button 
              onClick={onChange.onResetFilters} 
              variant="outline" 
              className="w-full border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white text-sm sm:text-base"
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Sliders de preço e desconto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-6">
          {/* Filtro de faixa de preço */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <label className="text-xs sm:text-sm font-semibold text-gray-800">Faixa de preço</label>
              <span className="text-xs sm:text-sm text-gray-600">${filters.lowerPrice} - ${filters.upperPrice}</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[filters.lowerPrice, filters.upperPrice]}
              onValueChange={(value) => onChange.onPriceRangeChange(value as [number, number])}
              className="w-full"
            >
              <div className="relative w-full h-2 sm:h-3 bg-gray-200 rounded-full">
                <div
                  className="absolute h-2 sm:h-3 bg-[#8B5CF6] rounded-full"
                  style={{ width: `${((filters.upperPrice - filters.lowerPrice) / 100) * 100}%`, left: `${(filters.lowerPrice / 100) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={filters.lowerPrice}
                  onChange={(e) => onChange.onPriceRangeChange([parseInt(e.target.value), filters.upperPrice] as [number, number])}
                  className="absolute w-full h-2 sm:h-3 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={filters.upperPrice}
                  onChange={(e) => onChange.onPriceRangeChange([filters.lowerPrice, parseInt(e.target.value)] as [number, number])}
                  className="absolute w-full h-2 sm:h-3 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>
            </Slider>
          </div>

          {/* Filtro de desconto mínimo */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <label className="text-xs sm:text-sm font-semibold text-gray-800">Desconto mínimo</label>
              <span className="text-xs sm:text-sm text-gray-600">{filters.minDiscount}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[filters.minDiscount]}
              onValueChange={(value) => onChange.onDiscountChange(value[0])}
              className="w-full"
            >
              <div className="relative w-full h-2 sm:h-3 bg-gray-200 rounded-full">
                <div
                  className="absolute h-2 sm:h-3 bg-[#F97316] rounded-full"
                  style={{ width: `${(filters.minDiscount / 100) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={filters.minDiscount}
                  onChange={(e) => onChange.onDiscountChange(parseInt(e.target.value))}
                  className="absolute w-full h-2 sm:h-3 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FiltersPanel;
