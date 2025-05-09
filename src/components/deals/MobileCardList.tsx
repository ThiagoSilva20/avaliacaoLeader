"use client";

import { DealCard } from "./DealCard";
import { type Deal } from "@/interfaces";

interface MobileCardListProps {
  deals: Deal[];
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function MobileCardList({
  deals,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: MobileCardListProps) {
  return (
    <div className="block sm:hidden space-y-2 p-2">
      {deals.map((deal) => (
        <DealCard
          key={deal.dealID || deal.id}
          deal={deal}
          getStoreName={getStoreName}
          formatSavings={formatSavings}
          truncateText={truncateText}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
}