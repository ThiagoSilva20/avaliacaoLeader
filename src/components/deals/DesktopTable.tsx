"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DealRow } from "./DealRow";
import { type Deal } from "@/interfaces";

interface DesktopTableProps {
  deals: Deal[];
  getStoreName: (storeID: number) => string;
  formatSavings: (savings: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  onOpenModal: (deal: Deal) => void;
}

export function DesktopTable({
  deals,
  getStoreName,
  formatSavings,
  truncateText,
  onOpenModal,
}: DesktopTableProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/3 text-gray-800 font-semibold text-xs xl:text-sm">
              Nome do Jogo
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Preço Atual
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Preço Original
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Desconto
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Loja
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Avaliação
            </TableHead>
            <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal, index) => (
            <DealRow
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