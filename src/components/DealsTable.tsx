import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info } from 'lucide-react';
import { type Deal } from '@/interfaces';
import storesService from '../services/storesService';

interface DealsTableProps {
  deals: Deal[];
  loading: boolean;
}

export function DealsTable({ deals, loading }: DealsTableProps) {
  const [storeNames, setStoreNames] = useState<Record<number, string>>({});
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadStoreNames = async () => {
      const storeIds = [...new Set(deals.map(deal => deal.storeID))];
      
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

  const formatSavings = (savings: number): string => {
    return parseFloat(savings.toString()).toFixed(0) + '%';
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const openDealModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[400px] sm:min-h-[500px]">
        <div className="flex justify-center items-center h-48 sm:h-64">
          <p className="text-gray-600 text-base sm:text-lg font-medium">Carregando...</p>
        </div>
      </Card>
    );
  }

  if (deals.length === 0) {
    return (
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[400px] sm:min-h-[500px]">
        <div className="flex justify-center items-center h-48 sm:h-64">
          <p className="text-gray-600 text-base sm:text-lg font-medium">Nenhum jogo encontrado com os filtros selecionados.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[400px] sm:min-h-[500px]">
        <div className="overflow-x-auto">
          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/3 text-gray-800 font-semibold text-xs sm:text-sm">Nome do Jogo</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Preço Atual</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Preço Original</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Desconto</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Loja</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Avaliação</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs sm:text-sm">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal, index) => (
                  <TableRow 
                    key={deal.dealID || deal.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                    onClick={() => openDealModal(deal)}
                  >
                    <TableCell className="font-medium text-gray-900 text-xs sm:text-sm whitespace-nowrap max-w-xs">
                      {deal.thumb && (
                        <div className="flex items-center gap-2 sm:gap-4">
                          <img 
                            src={deal.thumb} 
                            alt={deal.title} 
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/64/64';
                            }}
                          />
                          <span className="truncate">{truncateText(deal.title, 30)}</span>
                        </div>
                      )}
                      {!deal.thumb && <span className="truncate">{truncateText(deal.title, 30)}</span>}
                    </TableCell>
                    <TableCell className="text-gray-900 text-xs sm:text-sm">${Number(deal.salePrice).toFixed(2)}</TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm line-through">${Number(deal.normalPrice).toFixed(2)}</TableCell>
                    <TableCell className="text-gray-900 font-medium text-xs sm:text-sm">-{formatSavings(deal.savings)}</TableCell>
                    <TableCell className="text-gray-900 text-xs sm:text-sm whitespace-nowrap max-w-xs truncate">{getStoreName(deal.storeID)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-16 sm:w-20 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8B5CF6]" 
                            style={{ width: `${(deal.dealRating / 10) * 100}%` }} 
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700">{Number(deal.dealRating).toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs text-[#F97316] border-[#F97316] hover:bg-[#F97316] hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDealModal(deal);
                        }}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card layout for mobile */}
          <div className="block sm:hidden space-y-4 p-4">
            {deals.map((deal) => (
              <Card 
                key={deal.dealID || deal.id} 
                className="p-4 bg-gray-50 border border-gray-200"
                onClick={() => openDealModal(deal)}
              >
                <div className="flex items-center gap-3 mb-3">
                  {deal.thumb && (
                    <img 
                      src={deal.thumb} 
                      alt={deal.title} 
                      className="w-12 h-12 rounded-md object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                      }}
                    />
                  )}
                  <h3 className="text-sm font-medium text-gray-900 whitespace-nowrap max-w-xs truncate">{truncateText(deal.title, 30)}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Preço Atual:</span>
                    <span className="ml-1 text-gray-900 font-medium">${Number(deal.salePrice).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço Original:</span>
                    <span className="ml-1 text-gray-600 line-through">${Number(deal.normalPrice).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Desconto:</span>
                    <span className="ml-1 text-gray-900 font-medium">-{formatSavings(deal.savings)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Loja:</span>
                    <span className="ml-1 text-gray-900 whitespace-nowrap max-w-xs truncate">{getStoreName(deal.storeID)}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-gray-600">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8B5CF6]" 
                          style={{ width: `${(deal.dealRating / 10) * 100}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-700">{Number(deal.dealRating).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs text-[#F97316] border-[#F97316] hover:bg-[#F97316] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDealModal(deal);
                      }}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Deal Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg bg-white">
          {selectedDeal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">{selectedDeal.title}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Detalhes da promoção
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                {/* Game Image & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <img 
                      src={selectedDeal.thumb || '/api/placeholder/200/200'} 
                      alt={selectedDeal.title} 
                      className="w-full sm:w-40 sm:h-40 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/200/200';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-[#22C55E] text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{formatSavings(selectedDeal.savings)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600 text-sm">Loja:</div>
                      <div className="text-gray-900 font-medium text-sm">{getStoreName(selectedDeal.storeID)}</div>
                      
                      <div className="text-gray-600 text-sm">Preço Atual:</div>
                      <div className="text-gray-900 font-bold text-sm">${Number(selectedDeal.salePrice).toFixed(2)}</div>
                      
                      <div className="text-gray-600 text-sm">Preço Original:</div>
                      <div className="text-gray-500 line-through text-sm">${Number(selectedDeal.normalPrice).toFixed(2)}</div>
                      
                      <div className="text-gray-600 text-sm">Avaliação:</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8B5CF6]" 
                            style={{ width: `${(selectedDeal.dealRating / 10) * 100}%` }} 
                          />
                        </div>
                        <span className="text-sm text-gray-700">{Number(selectedDeal.dealRating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details if available */}
                {selectedDeal.steamRatingText && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Avaliação Steam:</h4>
                    <p className="text-sm text-gray-700">{selectedDeal.steamRatingText}</p>
                  </div>
                )}
                
                {selectedDeal.steamRatingPercent && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Porcentagem de avaliações positivas:</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8B5CF6]" 
                          style={{ width: `${selectedDeal.steamRatingPercent}%` }} 
                        />
                      </div>
                      <span className="text-sm text-gray-700">{selectedDeal.steamRatingPercent}%</span>
                    </div>
                  </div>
                )}
                
                {selectedDeal.steamAppID && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Steam App ID:</h4>
                    <p className="text-sm text-gray-700">{selectedDeal.steamAppID}</p>
                  </div>
                )}
                
                {selectedDeal.releaseDate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Data de Lançamento:</h4>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedDeal.releaseDate * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                
                {selectedDeal.lastChange && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Última Atualização:</h4>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedDeal.lastChange * 1000).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" className="sm:mr-auto border-gray-300 text-gray-700 hover:bg-gray-100">Fechar</Button>
                </DialogClose>
                
                {selectedDeal.dealID && (
                  <Button 
                    onClick={() => window.open(`https://www.cheapshark.com/redirect?dealID=${selectedDeal.dealID}`, '_blank')}
                    className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ir Para Loja
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DealsTable;