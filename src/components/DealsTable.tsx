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
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[300px] sm:min-h-[400px]">
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-600 text-sm sm:text-base font-medium">Carregando...</p>
        </div>
      </Card>
    );
  }

  if (deals.length === 0) {
    return (
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[300px] sm:min-h-[400px]">
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-600 text-sm sm:text-base font-medium">Nenhum jogo encontrado com os filtros selecionados.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 min-h-[300px] sm:min-h-[400px]">
        <div className="overflow-x-auto">
          {/* Table for larger screens (md and up) */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/3 text-gray-800 font-semibold text-xs xl:text-sm">Nome do Jogo</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Preço Atual</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Preço Original</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Desconto</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Loja</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Avaliação</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs xl:text-sm">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal, index) => (
                  <TableRow 
                    key={deal.dealID || deal.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                    onClick={() => openDealModal(deal)}
                  >
                    <TableCell className="font-medium text-gray-900 text-xs xl:text-sm whitespace-nowrap max-w-xs">
                      {deal.thumb && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={deal.thumb} 
                            alt={deal.title} 
                            className="w-10 h-10 xl:w-12 xl:h-12 rounded-md object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                            }}
                          />
                          <span className="hidden md:inline truncate">{truncateText(deal.title, 25)}</span>
                          <span className="inline md:hidden truncate">{truncateText(deal.title, 15)}</span>
                        </div>
                      )}
                      {!deal.thumb && (
                        <>
                          <span className="hidden md:inline truncate">{truncateText(deal.title, 25)}</span>
                          <span className="inline md:hidden truncate">{truncateText(deal.title, 15)}</span>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900 text-xs xl:text-sm">${Number(deal.salePrice).toFixed(2)}</TableCell>
                    <TableCell className="text-gray-600 text-xs xl:text-sm line-through">${Number(deal.normalPrice).toFixed(2)}</TableCell>
                    <TableCell className="text-gray-900 font-medium text-xs xl:text-sm">-{formatSavings(deal.savings)}</TableCell>
                    <TableCell className="text-gray-900 text-xs xl:text-sm whitespace-nowrap">
                      <span className="hidden lg:inline truncate max-w-xs">{getStoreName(deal.storeID)}</span>
                      <span className="inline lg:hidden truncate max-w-[80px]">{truncateText(getStoreName(deal.storeID), 10)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="w-12 xl:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8B5CF6]" 
                            style={{ width: `${(deal.dealRating / 10) * 100}%` }} 
                          />
                        </div>
                        <span className="text-xs xl:text-sm text-gray-700">{Number(deal.dealRating).toFixed(1)}</span>
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
                        <span className="hidden md:inline">Detalhes</span>
                        <span className="inline md:hidden">Ver</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Simplified table for tablet (sm to md) */}
          <div className="hidden sm:block md:hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-2/5 text-gray-800 font-semibold text-xs">Jogo</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs">Preço</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs">Desconto</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs">Loja</TableHead>
                  <TableHead className="text-gray-800 font-semibold text-xs">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal, index) => (
                  <TableRow 
                    key={deal.dealID || deal.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors cursor-pointer`}
                    onClick={() => openDealModal(deal)}
                  >
                    <TableCell className="font-medium text-gray-900 text-xs whitespace-nowrap max-w-xs">
                      {deal.thumb && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={deal.thumb} 
                            alt={deal.title} 
                            className="w-8 h-8 rounded-md object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/32/32';
                            }}
                          />
                          <span className="truncate">{truncateText(deal.title, 15)}</span>
                        </div>
                      )}
                      {!deal.thumb && <span className="truncate">{truncateText(deal.title, 15)}</span>}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="text-gray-900">${Number(deal.salePrice).toFixed(2)}</span>
                        <span className="text-gray-600 line-through text-xs">${Number(deal.normalPrice).toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium text-xs">-{formatSavings(deal.savings)}</TableCell>
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
                          openDealModal(deal);
                        }}
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card layout for mobile (xs to sm) */}
          <div className="block sm:hidden space-y-2 p-2">
            {deals.map((deal) => (
              <Card 
                key={deal.dealID || deal.id} 
                className="p-2 bg-gray-50 border border-gray-200"
                onClick={() => openDealModal(deal)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {deal.thumb && (
                    <img 
                      src={deal.thumb} 
                      alt={deal.title} 
                      className="w-10 h-10 rounded-md object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/40/40';
                      }}
                    />
                  )}
                  <h3 className="text-xs font-medium text-gray-900 truncate flex-1">{truncateText(deal.title, 25)}</h3>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div>
                    <span className="text-gray-600">Preço:</span>
                    <span className="ml-1 text-gray-900 font-medium">${Number(deal.salePrice).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Original:</span>
                    <span className="ml-1 text-gray-600 line-through">${Number(deal.normalPrice).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Desconto:</span>
                    <span className="ml-1 text-gray-900 font-medium">-{formatSavings(deal.savings)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs">
                    <span className="text-gray-600">Loja:</span>
                    <span className="ml-1 text-gray-900 truncate max-w-[100px]">{truncateText(getStoreName(deal.storeID), 12)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs text-[#F97316] border-[#F97316] hover:bg-[#F97316] hover:text-white px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDealModal(deal);
                    }}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Deal Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white w-[calc(100%-20px)] mx-auto">
          {selectedDeal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 break-words">{selectedDeal.title}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-600">
                  Detalhes da promoção
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-2 space-y-3">
                {/* Game Image & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-auto">
                    <img 
                      src={selectedDeal.thumb || '/api/placeholder/160/160'} 
                      alt={selectedDeal.title} 
                      className="w-full h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg object-cover border border-gray-200 mx-auto sm:mx-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/160/160';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-[#22C55E] text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{formatSavings(selectedDeal.savings)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm">
                      <div className="text-gray-600">Loja:</div>
                      <div className="text-gray-900 font-medium truncate">{getStoreName(selectedDeal.storeID)}</div>
                      
                      <div className="text-gray-600">Preço Atual:</div>
                      <div className="text-gray-900 font-bold">${Number(selectedDeal.salePrice).toFixed(2)}</div>
                      
                      <div className="text-gray-600">Preço Original:</div>
                      <div className="text-gray-500 line-through">${Number(selectedDeal.normalPrice).toFixed(2)}</div>
                      
                      <div className="text-gray-600">Avaliação:</div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8B5CF6]" 
                            style={{ width: `${(selectedDeal.dealRating / 10) * 100}%` }} 
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700">{Number(selectedDeal.dealRating).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details if available - displayed in a more compact way */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDeal.steamRatingText && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-800">Avaliação Steam:</h4>
                      <p className="text-xs text-gray-700">{selectedDeal.steamRatingText}</p>
                    </div>
                  )}
                  
                  {selectedDeal.steamRatingPercent && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-800">Avaliações positivas:</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8B5CF6]" 
                            style={{ width: `${selectedDeal.steamRatingPercent}%` }} 
                          />
                        </div>
                        <span className="text-xs text-gray-700">{selectedDeal.steamRatingPercent}%</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedDeal.steamAppID && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-800">Steam App ID:</h4>
                      <p className="text-xs text-gray-700">{selectedDeal.steamAppID}</p>
                    </div>
                  )}
                  
                  {selectedDeal.releaseDate && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-800">Data de Lançamento:</h4>
                      <p className="text-xs text-gray-700">
                        {new Date(selectedDeal.releaseDate * 1000).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  
                  {selectedDeal.lastChange && (
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-800">Última Atualização:</h4>
                      <p className="text-xs text-gray-700">
                        {new Date(selectedDeal.lastChange * 1000).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto sm:mr-auto border-gray-300 text-gray-700 hover:bg-gray-100">Fechar</Button>
                </DialogClose>
                
                {selectedDeal.dealID && (
                  <Button 
                    onClick={() => window.open(`https://www.cheapshark.com/redirect?dealID=${selectedDeal.dealID}`, '_blank')}
                    className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
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