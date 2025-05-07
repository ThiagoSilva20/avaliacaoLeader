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
    <Card className="mb-4 p-3 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Filtros</h2>

        {/* Primeira seção: Título e Loja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Busca por título */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Buscar por título</label>
            <Input
              placeholder="Digite o nome do jogo..."
              value={filters.searchTerm}
              onChange={(e) => onChange.onSearchChange(e.target.value)}
              className="border-gray-300 h-8 text-xs"
            />
          </div>

          {/* Filtro por loja */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Loja</label>
            <Select 
              value={filters.storeID || 'all'} 
              onValueChange={(value) => onChange.onStoreChange(value === 'all' ? '' : value)}
              disabled={loading}
            >
              <SelectTrigger className={`border-gray-300 h-8 m-auto text-xs ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}>
                <SelectValue placeholder={loading ? "Carregando..." : "Todas as lojas"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all" className="text-xs">Todas as lojas</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.storeID} value={store.storeID} className="text-xs">
                    {store.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda seção: Ordenação e Botão Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ordenação */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Ordenar por</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onChange.onSortChange(value as SortOption)}
            >
              <SelectTrigger className="border-gray-300 m-auto h-8 text-xs">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="dealRating" className="text-xs">Melhor avaliação</SelectItem>
                <SelectItem value="price" className="text-xs">Menor preço</SelectItem>
                <SelectItem value="savings" className="text-xs">Maior desconto</SelectItem>
                <SelectItem value="title" className="text-xs">Nome do jogo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de reset */}
          <div className="flex items-end">
            <Button 
              onClick={onChange.onResetFilters} 
              variant="outline" 
              className="w-full h-8 text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Sliders de preço e desconto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          {/* Filtro de faixa de preço */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-gray-800">Faixa de preço</label>
              <span className="text-xs text-gray-600">${filters.lowerPrice} - ${filters.upperPrice}</span>
            </div>
            <div className="px-1">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[filters.lowerPrice, filters.upperPrice]}
                onValueChange={(value) => onChange.onPriceRangeChange(value as [number, number])}
                className="w-full"
              />
            </div>
          </div>

          {/* Filtro de desconto mínimo */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-gray-800">Desconto mínimo</label>
              <span className="text-xs text-gray-600">{filters.minDiscount}%</span>
            </div>
            <div className="px-1">
              <Slider
                min={0}
                max={100}
                step={5}
                value={[filters.minDiscount]}
                onValueChange={(value) => onChange.onDiscountChange(value[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FiltersPanel;