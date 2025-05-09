/**
 * Formata o valor de desconto para exibição
 */
export const formatSavings = (savings: number): string => {
  return parseFloat(savings.toString()).toFixed(0) + "%";
};

/**
 * Trunca o texto para o tamanho máximo especificado
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};