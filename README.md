# Assistente de Encerramento de Chamados

Aplicação web para profissionais de Suporte de TI gerarem, editarem, copiarem e armazenarem registros técnicos padronizados de encerramento e encaminhamento de chamados.

## Projeto online

https://gabrielsp20.github.io/gerador-field/

O endereço foi mantido para preservar o acesso aos dados existentes no `localStorage` do navegador.

## Funcionalidades

- Tipos de encerramento para situações recorrentes do Service Desk
- Modelos prontos que permanecem totalmente editáveis
- Validação dos campos obrigatórios e do chamado de encaminhamento conforme o tipo selecionado
- Geração e cópia do texto em uma única ação
- Edição do texto final antes da cópia
- Salvamento automático do rascunho
- Tratamento de falhas ou bloqueios do armazenamento do navegador
- Histórico de encerramentos com pesquisa
- Visualização, cópia, reutilização e exclusão de registros
- Compatibilidade com rascunhos e históricos criados na versão anterior
- Armazenamento local, sem envio de informações para servidores externos
- Layout responsivo para computador e celular

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage

## Como executar

Abra o arquivo `index.html` no navegador ou utilize uma extensão como Live Server no Visual Studio Code.

No GitHub Pages, as URLs do CSS e do JavaScript possuem uma versão para evitar que uma publicação nova seja combinada com arquivos antigos mantidos no cache do navegador.

## Armazenamento e compatibilidade

Os dados continuam sendo armazenados somente no navegador. As chaves legadas `rascunhoField` e `historicoField` foram mantidas, e o antigo campo `testes` é recuperado como `Solução aplicada`, evitando perda dos dados já salvos.

Ao limpar o formulário ou apagar o rascunho, qualquer salvamento automático pendente é cancelado. O histórico é preservado nessas duas ações e só é alterado pelos controles da seção correspondente.

## Autor

Desenvolvido por Gabriel.
