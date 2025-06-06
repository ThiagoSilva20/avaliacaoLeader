"use client";

import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[300px] sm:min-h-[400px]">
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          Nenhum jogo encontrado com os filtros selecionados.
        </p>
      </div>
    </Card>
  );
}