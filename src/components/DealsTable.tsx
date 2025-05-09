"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { type Deal } from "@/interfaces";
import storesService from "../services/storesService";
import GameModal from "./deals/GameModal";
import { DesktopTable } from "./deals/DesktopTable";
import { TabletTable } from "./deals/TabletTable";
import { MobileCardList } from "./deals/MobileCardList";
import { Pagination } from "./deals/Pagination";
import { LoadingState } from "./deals/LoadingState";
import { EmptyState } from "./deals/EmptyState";
import { formatSavings, truncateText } from "./deals/utils";

interface DealsTableProps {
  deals: Deal[];
  loading: boolean;
}

export function DealsTable({ deals, loading }: DealsTableProps) {
  const [storeNames, setStoreNames] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadStoreNames = async () => {
      const storeIds = [...new Set(deals.map((deal) => deal.storeID))];
      const namesMap: Record<number, string> = {};
      await Promise.all(
        storeIds.map(async (id) => {
          const name = await storesService.getStoreName(id);
          namesMap[id] = name;
        })
      );
      setStoreNames(namesMap);
    };

    if (deals.length > 0) {
      loadStoreNames();
    }
  }, [deals]);

  const getStoreName = (storeID: number) => {
    return storeNames[storeID] || `Loja ${storeID}`;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeals = deals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(deals.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle opening the modal
  const openModal = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedDeal(null);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (deals.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[300px] sm:min-h-[400px]">
        <div className="overflow-x-auto">
          {/* Table for different screen sizes */}
          <DesktopTable
            deals={currentDeals}
            getStoreName={getStoreName}
            formatSavings={formatSavings}
            truncateText={truncateText}
            onOpenModal={openModal}
          />
          
          <TabletTable
            deals={currentDeals}
            getStoreName={getStoreName}
            formatSavings={formatSavings}
            truncateText={truncateText}
            onOpenModal={openModal}
          />
          
          <MobileCardList
            deals={currentDeals}
            getStoreName={getStoreName}
            formatSavings={formatSavings}
            truncateText={truncateText}
            onOpenModal={openModal}
          />
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Deal Details Modal */}
      {selectedDeal && (
        <GameModal 
          deal={selectedDeal} 
          storeNames={storeNames} 
          onClose={closeModal} 
        />
      )}
    </>
  );
}

export default DealsTable;