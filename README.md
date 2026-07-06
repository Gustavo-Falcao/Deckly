# Deckly
Esse projeto é um webApp desenvolvido para a criação e gerenciamento de decks e cards de estudo voltado para aprimorar o vocabulário. Ele foi pensado para uso direto no navegador, como foco principal em dispositivos móveis. 

## Demostração
[Acessar webApp](https://gustavo-falcao.github.io/Deckly/#/decks)

## Tecnologias utilizadas
- React
- Vite
- TypeScript
- React Router DOM
- LocalStorage
- GitHub Pages
- gh-pages

## Como funciona
O sistema funciona totalmente no lado do cliente, ou seja, não possui backend nem API externa.

Os dados criados pelo usuário são salvos no LocalStorage do navegador.

## Armazenamento dos dados
Os dados são armazenados no localStorage do navegador.

Isso significa que:
- os dados ficam salvos apenas no dispositivo/navegador usado;
- não existe sincronização entre aparelhos;
- se o usuário limpar os dados do navegador, as informações podem ser perdidas;
- o app não possui login, conta de usuário ou banco de dados externo.

## Funcionalidades
- Criar, editar, excluir decks de estudo
- Criar, editar, excluir cards dentro de um deck
- Buscar decks e cards
- Filtrar cards
- Treinar os cards de um deck

## Modo de treino
O modo de treino permite que o usuário pratique os cards cadastrados em um deck.

Durante o treino, o usuário visualiza os significados de cada card de forma aleatória e tenta adivinhar qual é a palavra presente na frase escolhida do deck selecionado e pode revisar seus conteúdos de forma sequencial. Essa funcionalidade foi criada para transformar os cards cadastrados em uma experiência prática de estudo.

O treino utiliza apenas os significados que tem exemplo com a palavra escondida e dados armazenados localmente no navegador, sem comunicação com API ou banco de dados externo.

## Recomendações de uso
Embora o webApp funcione no navegador, ele foi pensado principalmente para uso em celulares.

### A melhor forma de utilizar o app: 
- acessar ele pelo navegador no celular;
- adicionar a página na homeScreen do celular.

## Limitações
- O app não possui backend.
- O app não possui login.
- Os dados não sincronizam entre dispositivos.
- Os dados podem ser perdidos caso o usuário limpe o LocalStorage do navegador.
- O uso é recomendado no mesmo navegador e no mesmo dispositivo.

## Como rodar localmente
Clone o repositório:
```bash
git clone https://github.com/Gustavo-Falcao/Deckly.git
```

Instale as dependências:
```bash
npm install
```

Execute o projeto:
```bash
npm run dev
```

## Deploy
O projeto foi hospedado no GitHub Pages utilizando a biblioteca gh-pages.

## Melhorias futuras
- Criar um API própria com autenticação e validação
- Criar banco de dados
- Implementar interface para desktop