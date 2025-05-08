# 🕹️ Game Deals Dashboard

Game Deals Dashboard é uma aplicação web desenvolvida com React e TypeScript que exibe uma lista interativa das melhores ofertas de jogos em lojas digitais. A proposta é oferecer aos usuários uma maneira fácil e intuitiva de encontrar jogos com grandes descontos, com diversos filtros, ordenações e uma interface responsiva.

---

## ✨ Funcionalidades

* **Busca por nome do jogo:** filtragem em tempo real conforme o usuário digita.
* **Filtro por loja:** selecione uma loja específica para refinar os resultados.
* **Filtro por faixa de preço:** escolha um intervalo mínimo e máximo de valor.
* **Filtro por desconto:** defina um percentual mínimo para exibir apenas grandes ofertas.
* **Ordenação:** organize por título, menor preço, maior desconto ou avaliação da oferta.
* **Interface responsiva:** design adaptado para dispositivos móveis, tablets e desktops.
* **Modal de detalhes:** clique na oferta para ver informações completas sobre o jogo.
* **Consumo de dados da CheapShark API:** acesso a ofertas atualizadas em tempo real.
* **Cache de lojas:** otimiza a performance evitando chamadas repetidas para nomes das lojas.

---

## 🚀 Tecnologias Utilizadas

* **React 19:** Biblioteca para criação de interfaces reativas e declarativas.
* **TypeScript:** Tipagem estática para melhor manutenção e segurança de código.
* **Tailwind CSS 4:** Framework utilitário para estilização rápida e responsiva.
* **Shadcn/UI:** Componentes de interface reutilizáveis e estilizáveis.
* **Lucide React:** Biblioteca de ícones moderna e leve.
* **Axios:** Cliente HTTP para comunicação com a API.
* **CheapShark API:** Fonte de dados com informações atualizadas sobre promoções de jogos.

---

## 📚 Estrutura de Pastas

```
src/
├── api/               # Configuração do cliente Axios
│   └── api.ts         # Configuração do Axios para a CheapShark API
├── assets/            # Arquivos estáticos
│   └── react.svg      # Icon da página
├── components/        # Componentes reutilizáveis
│   ├── ui/            # Componentes de UI base (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   └── table.tsx
│   ├── DealsTable.tsx # Tabela de ofertas
│   ├── FiltersPanel.tsx # Painel de filtros
│   └── lib/           # Utilitários compartilhados
├── services/          # Serviços e lógica de negócios
│   └── storesService.ts # Serviço para gerenciar lojas
├── App.tsx            # Componente principal
├── index.css          # Estilos globais
├── interfaces.ts      # Definições de tipos e interfaces
└── main.tsx           # Ponto de entrada da aplicação
```

---

## 🚧 Como Executar o Projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/ThiagoSilva20/avaliacaoLeader.git
cd avaliacaoLeader
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

### 4. Acesse a aplicação

Abra `http://localhost:5173` no navegador.

---

## 📃 Scripts Disponíveis

| Comando         | Ação                                   |
| --------------- | -------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento   |
| `npm run build` | Compila TypeScript e cria o build para produção |
| `npm run lint`  | Executa a análise de código com ESLint |

---

## 🔍 Detalhamento dos Componentes

### `DealsTable.tsx`

* Renderiza a tabela responsiva de ofertas com três layouts diferentes:
  * Desktop: Tabela completa com todas as informações
  * Tablet: Tabela simplificada com colunas essenciais
  * Mobile: Cards individuais para melhor visualização
* Implementa o modal de detalhes com Dialog do shadcn/ui
* Utiliza o serviço de lojas para exibir nomes em vez de IDs
* Possui tratamento para imagens ausentes com fallback

### `FiltersPanel.tsx`

* Componente de filtros com:
  * Input para busca por título
  * Select para filtro de lojas
  * Slider para faixa de preço
  * Slider para desconto mínimo
  * Seletor de ordenação
  * Botão para reset de filtros
* Gerencia estados e eventos através de props
* Consumo do StoresService para exibir a lista de lojas

### `storesService.ts`

* Implementa padrão Singleton para garantir uma única instância
* Utiliza cache para evitar múltiplas requisições à API
* Fornece fallback de lojas caso a API esteja indisponível
* Métodos para busca de nomes de lojas por ID

### `App.tsx`

* Componente principal que coordena toda a aplicação
* Gerencia o estado global dos dados e filtros
* Implementa a lógica de filtragem e ordenação com useEffect
* Coordena a comunicação entre componentes filhos

---

## 💬 FAQ

**1. Por que os nomes das lojas demoram a carregar?**
O serviço de lojas implementa um sistema de cache inteligente. Na primeira vez que a aplicação é carregada, os nomes podem demorar um pouco, mas nas próximas chamadas serão instantâneos.

**2. O que acontece se a CheapShark API falhar?**
Implementamos um sistema de fallback que mantém uma lista de lojas comuns. Além disso, a aplicação exibe mensagens de erro amigáveis e continua funcionando com os recursos disponíveis.

**3. Como posso contribuir?**
Você pode abrir issues para reportar bugs ou sugerir melhorias, ou enviar pull requests diretamente para o repositório.

---

## 👔 Autor

Feito com ❤️ por **Thiago Silva**

* [LinkedIn](https://www.linkedin.com/in/thiago-da-silva-machado)
* [GitHub](https://github.com/ThiagoSilva20)
* [Portfólio](https://thiagosilva-alpha.vercel.app/)

---

## ✉️ Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.

---

> Este projeto foi desenvolvido para demonstrar boas práticas de desenvolvimento frontend com React, TypeScript e Tailwind CSS, focando em uma experiência de usuário fluida e responsiva para busca de promoções de jogos.
