"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { type Deal } from "@/interfaces";

interface DealCardProps {
  deal: Deal;
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function DealCard({
  deal,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: DealCardProps) {
  return (
    <Card
      key={deal.dealID || deal.id}
      className="p-2 bg-gray-50 border border-gray-200 cursor-pointer"
      onClick={() => onOpenModal(deal)}
    >
      <div className="flex items-center gap-2 mb-2">
        {deal.thumb && (
          <img
            src={deal.thumb}
            alt={deal.title}
            className="w-10 h-10 rounded-md object-cover border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/api/placeholder/40/40";
            }}
          />
        )}
        <h3 className="text-xs font-medium text-gray-900 truncate flex-1">
          {truncateText(deal.title, 25)}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-1 text-xs">
        <div>
          <span className="text-gray-600">Preço:</span>
          <span className="ml-1 text-gray-900 font-medium">
            ${Number(deal.salePrice).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Original:</span>
          <span className="ml-1 text-gray-600 line-through">
            ${Number(deal.normalPrice).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Desconto:</span>
          <span className="ml-1 text-gray-900 font-medium">
            -{formatSavings(deal.savings)}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs">
          <span className="text-gray-600">Loja:</span>
          <span className="ml-1 text-gray-900 truncate max-w-[100px]">
            {truncateText(getStoreName(deal.storeID), 12)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-[#F97316] border-[#F97316] hover:bg-[#F97316] hover:text-white p-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(deal);
          }}
        >
          <Info className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}