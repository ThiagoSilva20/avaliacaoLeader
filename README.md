# 🕹️ Game Deals Dashboard

Game Deals Dashboard é uma aplicação web desenvolvida com React e TypeScript que exibe uma lista interativa das melhores ofertas de jogos em lojas digitais. A proposta é oferecer aos usuários uma maneira fácil e intuitiva de encontrar jogos com grandes descontos, com diversos filtros, ordenações e uma interface responsiva.

[Preview da aplicação](https://avaliacao-leader.vercel.app/)

---

## ✨ Funcionalidades

* **Busca por nome do jogo:** filtragem em tempo real conforme o usuário digita.
* **Filtro por loja:** selecione uma ou mais lojas para refinar os resultados.
* **Filtro por faixa de preço:** escolha um intervalo mínimo e máximo de valor.
* **Filtro por desconto:** defina um percentual mínimo para exibir apenas grandes ofertas.
* **Ordenação:** organize por título, menor preço, maior desconto ou nota da loja.
* **Tabela responsiva:** design adaptado para dispositivos móveis e desktops.
* **Modal de detalhes:** clique na oferta e veja mais informações.
* **Consumo de dados da CheapShark API:** acesso a ofertas atualizadas em tempo real.
* **Cache de lojas:** otimiza a performance evitando chamadas repetidas para nomes das lojas.

---

## 🚀 Tecnologias Utilizadas

* **React**: Biblioteca para criação de interfaces reativas e declarativas.
* **TypeScript**: Tipagem estática para melhor manutenção e segurança de código.
* **Tailwind CSS**: Framework utilitário para estilização rápida e responsiva.
* **Lucide React**: Biblioteca de ícones moderna e leve.
* **CheapShark API**: Fonte de dados com informações atualizadas sobre promoções de jogos.

---

## 📚 Estrutura de Pastas

```
src/
├── api/               # Configuração do cliente Axios
├── components/        # Componentes reutilizáveis (filtros, tabela, modal)
├── services/          # Serviços de cache e consumo da API
├── interfaces.ts      # Tipagens TypeScript
├── App.tsx            # Componente principal
├── main.tsx           # Ponto de entrada da aplicação
└── styles/            # Configurações do Tailwind e estilos globais
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
| `npm run build` | Cria o build otimizado para produção   |
| `npm run lint`  | Executa a análise de código com ESLint |

---

## 🔍 Detalhamento dos Componentes

### `DealsTable.tsx`

* Renderiza a tabela responsiva de ofertas
* Permite interações como abrir o modal ao clicar na linha
* Usa memoização de nomes de lojas com fallback

### `FiltersPanel.tsx`

* Componente de filtros com input, select e sliders
* Atualiza o estado dos filtros de forma reativa
* Controlado por props vindas do componente pai

### `storesService.ts`

* Garante que a lista de lojas é carregada apenas uma vez
* Usa uma Promise compartilhada para evitar concorrência
* Aplica fallback com lojas fixas se a API falhar

### `App.tsx`

* Componente principal que gerencia todo o estado
* Faz a busca dos dados da CheapShark
* Aplica filtros e ordenação com `useMemo` e `useCallback`

---

## 💬 FAQ

**1. Por que os nomes das lojas demoram a carregar?**
Para evitar chamadas desnecessárias, o sistema espera o carregamento completo da lista de lojas antes de associar os nomes aos `storeID`.

**2. O que acontece se a CheapShark API falhar?**
O sistema usa um fallback com nomes de lojas mais comuns, permitindo a renderização da tabela mesmo offline.

**3. Como posso contribuir?**
Abra uma issue, sugira melhorias ou envie pull requests diretamente para o repositório. Toda ajuda é bem-vinda!

---

## 👔 Autor

Feito com ❤️ por **Thiago Silva**

* [LinkedIn](https://www.linkedin.com/in/thiago-da-silva-machado)
* [Instagram](https://instagram.com/sillva_ty)
* [Portfólio](https://thiagosilva-alpha.vercel.app/)

---

## ✉️ Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.

---

> Este projeto foi criado como parte de um estudo de aplicações modernas com React + TypeScript + Tailwind, e visa demonstrar boas práticas de desenvolvimento frontend com consumo de APIs externas.
