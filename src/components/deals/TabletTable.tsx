"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TabletDealRow } from "./TabletDealRow";
import { type Deal } from "@/interfaces";

interface TabletTableProps {
  deals: Deal[];
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function TabletTable({
  deals,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: TabletTableProps) {
  return (
    <div className="hidden sm:block md:hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-2/5 text-gray-800 font-semibold text-xs">
              Jogo
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs">
              Preço
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs">
              Desconto
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs">
              Loja
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal, index) => (
            <TabletDealRow
              key={deal.dealID || deal.id}
              deal={deal}
              index={index}
              getStoreName={getStoreName}
              formatSavings={formatSavings}
              truncateText={truncateText}
              onOpenModal={onOpenModal}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}