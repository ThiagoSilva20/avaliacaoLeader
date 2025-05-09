"use client";

import { TableCell, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { type Deal } from "@/interfaces";

interface TabletDealRowProps {
  deal: Deal;
  index: number;
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function TabletDealRow({
  deal,
  index,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: TabletDealRowProps) {
  return (
    <TableRow
      key={deal.dealID || deal.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100 transition-colors cursor-pointer`}
      onClick={() => onOpenModal(deal)}
    >
      <TableCell className="font-medium text-gray-900 text-xs whitespace-nowrap max-w-xs">
        {deal.thumb && (
          <div className="flex items-center gap-2">
            <img
              src={deal.thumb}
              alt={deal.title}
              className="w-8 h-8 rounded-md object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/32/32";
              }}
            />
            <span className="truncate">{truncateText(deal.title, 15)}</span>
          </div>
        )}
        {!deal.thumb && (
          <span className="truncate">{truncateText(deal.title, 15)}</span>
        )}
      </TableCell>
      <TableCell className="text-xs">
        <div className="flex flex-col">
          <span className="text-gray-900">
            ${Number(deal.salePrice).toFixed(2)}
          </span>
          <span className="text-gray-600 line-through text-xs">
            ${Number(deal.normalPrice).toFixed(2)}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium text-xs">
        -{formatSavings(deal.savings)}
      </TableCell>
      <TableCell className="text-gray-900 text-xs whitespace-nowrap truncate max-w-[80px]">
        {truncateText(getStoreName(deal.storeID), 8)}
      </TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}