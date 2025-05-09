import {
  type FilterParams,
  type FilterChangeHandler,
} from "../interfaces";
import FilterSidebar from "./FilterSidebar";

interface FiltersPanelProps {
  filters: FilterParams;
  onChange: FilterChangeHandler;
  variant?: "default" | "sidebar" | "horizontal";
  compact?: boolean;
  className?: string;
}

export default function FiltersPanel({ 
  filters, 
  onChange, 
  variant = "default",
  compact = false,
  className = ""
}: FiltersPanelProps) {
  // Render the appropriate filter component based on the variant prop
  if (variant === "sidebar") {
    return (
      <FilterSidebar 
        filters={filters} 
        onChange={onChange}
        variant="sidebar"
        className={className} 
      />
    );
  }

  if (variant === "horizontal") {
    return (
      <FilterSidebar 
        filters={filters} 
        onChange={onChange}
        variant="horizontal"
        compact={compact}
        className={className} 
      />
    );
  }
  
  // Default case
  return (
    <div className={className}>
      {/* Renderizando o componente com layout horizontal por padrão */}
      <FilterSidebar 
        filters={filters} 
        onChange={onChange}
        variant="horizontal"
        compact={compact}
        className=""
      />
    </div>
  );
}