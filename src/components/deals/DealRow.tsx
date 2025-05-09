"use client";

import { TableCell, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { type Deal } from "@/interfaces";

interface DealRowProps {
  deal: Deal;
  index: number;
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function DealRow({
  deal,
  index,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: DealRowProps) {
  return (
    <TableRow
      key={deal.dealID || deal.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100 transition-colors cursor-pointer`}
      onClick={() => onOpenModal(deal)}
    >
      <TableCell className="font-medium text-gray-900 text-xs xl:text-sm whitespace-nowrap max-w-xs">
        {deal.thumb && (
          <div className="flex items-center gap-2">
            <img
              src={deal.thumb}
              alt={deal.title}
              className="w-10 h-10 xl:w-12 xl:h-12 rounded-md object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/48/48";
              }}
            />
            <span className="hidden md:inline truncate">
              {truncateText(deal.title, 25)}
            </span>
            <span className="inline md:hidden truncate">
              {truncateText(deal.title, 15)}
            </span>
          </div>
        )}
        {!deal.thumb && (
          <>
            <span className="hidden md:inline truncate">
              {truncateText(deal.title, 25)}
            </span>
            <span className="inline md:hidden truncate">
              {truncateText(deal.title, 15)}
            </span>
          </>
        )}
      </TableCell>
      <TableCell className="text-gray-900 text-xs xl:text-sm">
        ${Number(deal.salePrice).toFixed(2)}
      </TableCell>
      <TableCell className="text-gray-600 text-xs xl:text-sm line-through">
        ${Number(deal.normalPrice).toFixed(2)}
      </TableCell>
      <TableCell className="text-gray-900 font-medium text-xs xl:text-sm">
        -{formatSavings(deal.savings)}
      </TableCell>
      <TableCell className="text-gray-900 text-xs xl:text-sm whitespace-nowrap">
        <span className="hidden lg:inline truncate max-w-xs">
          {getStoreName(deal.storeID)}
        </span>
        <span className="inline lg:hidden truncate max-w-[80px]">
          {truncateText(getStoreName(deal.storeID), 10)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <div className="w-12 xl:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B5CF6]"
              style={{
                width: `${(deal.dealRating / 10) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs xl:text-sm text-gray-700">
            {Number(deal.dealRating).toFixed(1)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-[#F97316] border-[#F97316] hover:bg-[#F97316] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(deal);
          }}
        >
          <Info className="h-3 w-3 mr-1" />
          <span className="hidden md:inline">Detalhes</span>
          <span className="inline md:hidden">Ver</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}