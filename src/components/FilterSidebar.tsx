import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Store,
  type FilterParams,
  type SortOption,
  type FilterChangeHandler,
} from "../interfaces";
import storesService from "../services/storesService";

// Definição de estilos CSS globais para o Slider
// Você pode adicionar isso ao seu arquivo global.css ou criar um arquivo específico
const sliderStyles = `
  /* Estilizando o track (trilha) do slider */
  .slider-custom [data-orientation="horizontal"] {
    height: 8px;
    border-radius: 4px;
    background-color: #e5e7eb; /* Cinza claro (gray-200) */
  }

  /* Estilizando o range (parte preenchida) do slider */
  .slider-custom [data-orientation="horizontal"] [data-disabled] {
    background-color: #22c55e; /* Verde (green-500) */
    height: 100%;
  }

  /* Estilizando o thumb (controle deslizante) do slider */
  .slider-custom [role="slider"] {
    height: 16px;
    width: 16px;
    background-color: white;
    border: 2px solid #22c55e; /* Verde (green-500) */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: grab;
  }

  /* Estilo quando o thumb está sendo arrastado */
  .slider-custom [role="slider"]:active {
    cursor: grabbing;
    border-color: #16a34a; /* Verde mais escuro (green-600) */
    transform: scale(1.1);
  }

  /* Estilo quando o thumb está em foco */
  .slider-custom [role="slider"]:focus-visible {
    outline: none;
    ring: 2px solid #22c55e;
    ring-offset: 2px;
  }
`;

interface FilterSidebarProps {
  filters: FilterParams;
  onChange: FilterChangeHandler;
  variant?: "sidebar" | "horizontal";
  compact?: boolean;
  className?: string;
}

export function FilterSidebar({ 
  filters, 
  onChange, 
  variant = "sidebar",
  compact = false,
  className = "" 
}: FilterSidebarProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(!compact);

  const isHorizontal = variant === "horizontal";

  // Injetar estilos CSS ao montar o componente
  useEffect(() => {
    // Adicionar estilos apenas se ainda não existirem
    if (!document.getElementById('slider-custom-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'slider-custom-styles';
      styleElement.textContent = sliderStyles;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Opcional: remover estilos ao desmontar o componente
      // const styleElement = document.getElementById('slider-custom-styles');
      // if (styleElement) document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storeData = await storesService.getStores();
        setStores((storeData as Store[]).filter(store => store.isActive === 1));
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Componente para renderizar um slider com label
  interface FilterSliderProps {
    label: string;
    value: number | number[];
    onChange: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    format?: (value: number | number[]) => string;
  }

  const FilterSlider = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1,
    format = (v: number | number[]) => `${v}`
  }: FilterSliderProps) => (
    <div className={`space-y-2 bg-gray-50 rounded-lg ${isHorizontal ? 'p-3' : 'p-4'}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-medium text-green-600">{format(value)}</span>
      </div>
      <div className="px-2 py-3 slider-custom">
        <Slider
          min={min}
          max={max}
          step={step}
          value={Array.isArray(value) ? value : [value]}
          onValueChange={onChange}
          className="relative w-full touch-none select-none"
        />
      </div>
    </div>
  );

  // Opções de ordenação
  const sortOptions = [
    { value: "dealRating", label: "Melhor avaliação" },
    { value: "price", label: "Menor preço" },
    { value: "savings", label: "Maior desconto" },
    { value: "title", label: "Nome do jogo" }
  ];

  const Container = isHorizontal ? Card : "div";
  
  return (
    <Container className={`bg-white shadow-lg rounded-lg border border-gray-200 ${isHorizontal ? 'p-3' : 'p-4'} ${className}`}>
      <div className={`${isHorizontal ? 'space-y-3' : 'space-y-5'}`}>
        <div className={`${isHorizontal ? 'flex justify-between items-center' : ''}`}>
          <h2 className={`text-lg font-bold text-gray-800 ${!isHorizontal ? 'mb-4' : ''}`}>Filtros</h2>
          {compact && isHorizontal && (
            <Button 
              variant="ghost" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-green-600 hover:text-green-800"
            >
              {showAdvanced ? "Ocultar filtros avançados" : "Mostrar filtros avançados"}
            </Button>
          )}
        </div>

        {!isHorizontal && (
          <Button
            onClick={onChange.onResetFilters}
            variant="outline"
            className="w-full mb-4 text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            Limpar filtros
          </Button>
        )}

        {/* Campos de filtro */}
        <div className={isHorizontal ? "grid grid-cols-1 md:grid-cols-3 gap-3" : ""}>
          {/* Busca por título */}
          <div className={`${isHorizontal ? 'space-y-1' : 'space-y-2'}`}>
            <label className={`${isHorizontal ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>
              Buscar por título
            </label>
            <Input
              placeholder="Digite o nome do jogo..."
              value={filters.searchTerm}
              onChange={(e) => onChange.onSearchChange(e.target.value)}
              className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${isHorizontal ? 'h-9 text-xs' : 'text-sm'}`}
            />
          </div>

          {/* Filtro por loja */}
          <div className={`${isHorizontal ? 'space-y-1' : 'space-y-2'}`}>
            <label className={`${isHorizontal ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>
              Loja
            </label>
            <Select
              value={filters.storeID || "all"}
              onValueChange={(value) => onChange.onStoreChange(value === "all" ? "" : value)}
              disabled={loading}
            >
              <SelectTrigger
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${isHorizontal ? 'h-9 text-xs' : 'text-sm'} ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
              >
                <SelectValue placeholder={loading ? "Carregando..." : "Todas as lojas"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all" className={isHorizontal ? 'text-xs' : 'text-sm'}>
                  Todas as lojas
                </SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.storeID} value={store.storeID} className={isHorizontal ? 'text-xs' : 'text-sm'}>
                    {store.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenação */}
          <div className={`${isHorizontal ? 'space-y-1' : 'space-y-2'}`}>
            <label className={`${isHorizontal ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>
              Ordenar por
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onChange.onSortChange(value as SortOption)}
            >
              <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${isHorizontal ? 'h-9 text-xs' : 'text-sm'}`}>
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className={isHorizontal ? 'text-xs' : 'text-sm'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados */}
        {(!compact || showAdvanced) && (
          <div className={isHorizontal ? "pt-2" : ""}>
            <div className={isHorizontal ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {/* Filtro de faixa de preço */}
              <FilterSlider 
                label="Faixa de preço"
                value={[filters.lowerPrice, filters.upperPrice]}
                onChange={(value) => onChange.onPriceRangeChange(value as [number, number])}
                format={(v: number | number[]) => {
                  const values = Array.isArray(v) ? v : [v];
                  return `R$ ${values[0]} - R$ ${values[1]}`;
                }}
              />

              {/* Filtro de desconto mínimo */}
              <FilterSlider 
                label="Desconto mínimo"
                value={[filters.minDiscount]}
                onChange={(value) => onChange.onDiscountChange(value[0])}
                step={5}
                format={(v: number | number[]) => {
                  const values = Array.isArray(v) ? v : [v];
                  return `${values[0]}%`;
                }}
              />
            </div>
          </div>
        )}

        {/* Botão de reset (apenas no layout horizontal) */}
        {isHorizontal && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={onChange.onResetFilters}
              variant="outline"
              className="h-8 text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default FilterSidebar;