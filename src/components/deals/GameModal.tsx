"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameModalProps {
  deal: Deal;
  storeNames?: Record<number, string>;
  onClose?: () => void;
}

interface Deal {
  id?: string;
  dealID?: string;
  title: string;
  storeID: number;
  salePrice: number | string;
  normalPrice: number | string;
  savings: number;
  dealRating: number;
  thumb?: string;
  // Campos opcionais que podem ser usados pelo modal
  steamRatingText?: string;
  steamRatingPercent?: number;
  steamAppID?: string;
  releaseDate?: number;
  lastChange?: number;
}

export default function GameModal({ deal, storeNames = {}, onClose }: GameModalProps) {
  const getStoreName = (storeID: number) => {
    return storeNames[storeID] || `Loja ${storeID}`;
  };

  const formatSavings = (savings: number): string => {
    return parseFloat(savings.toString()).toFixed(0) + "%";
  };

  // Sempre aberto quando recebe um deal
  const isOpen = !!deal;

  // Função para fechar o modal
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white w-[calc(100%-20px)] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 break-words">
            {deal.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-600">
            Detalhes da oferta para {deal.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {/* Game Image & Basic Info */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-auto">
              <img
                src={deal.thumb || "/api/placeholder/160/160"}
                alt={deal.title}
                className="w-full h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg object-cover border border-gray-200 mx-auto sm:mx-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/api/placeholder/160/160";
                }}
              />
              <div className="absolute top-2 right-2 bg-[#22C55E] text-white text-xs font-bold px-2 py-1 rounded-full">
                -{formatSavings(deal.savings)}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm">
                <div className="text-gray-600">Loja:</div>
                <div className="text-gray-900 font-medium truncate">
                  {getStoreName(deal.storeID)}
                </div>

                <div className="text-gray-600">Preço Atual:</div>
                <div className="text-gray-900 font-bold">
                  ${Number(deal.salePrice).toFixed(2)}
                </div>

                <div className="text-gray-600">Preço Original:</div>
                <div className="text-gray-500 line-through">
                  ${Number(deal.normalPrice).toFixed(2)}
                </div>

                <div className="text-gray-600">Avaliação:</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8B5CF6]"
                      style={{
                        width: `${(deal.dealRating / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">
                    {Number(deal.dealRating).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {deal.steamRatingText && (
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-800">
                  Avaliação Steam:
                </h4>
                <p className="text-xs text-gray-700">{deal.steamRatingText}</p>
              </div>
            )}

            {deal.steamRatingPercent && (
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-800">
                  Avaliações positivas:
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8B5CF6]"
                      style={{
                        width: `${deal.steamRatingPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-700">
                    {deal.steamRatingPercent}%
                  </span>
                </div>
              </div>
            )}

            {deal.steamAppID && (
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-800">
                  Steam App ID:
                </h4>
                <p className="text-xs text-gray-700">{deal.steamAppID}</p>
              </div>
            )}

            {deal.releaseDate && (
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-800">
                  Data de Lançamento:
                </h4>
                <p className="text-xs text-gray-700">
                  {new Date(deal.releaseDate * 1000).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}

            {deal.lastChange && (
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-800">
                  Última Atualização:
                </h4>
                <p className="text-xs text-gray-700">
                  {new Date(deal.lastChange * 1000).toLocaleDateString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto sm:mr-auto border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={handleClose}
            >
              Fechar
            </Button>
          </DialogClose>

          {deal.dealID && (
            <Button
              onClick={() =>
                window.open(
                  `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
                  "_blank"
                )
              }
              className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir Para Loja
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}