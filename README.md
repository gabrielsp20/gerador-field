# Assistente de Encerramento de Chamados

Aplicação web para profissionais de Suporte de TI gerarem, editarem, copiarem e armazenarem registros técnicos padronizados de encerramento e encaminhamento de chamados.

## Projeto online

https://gabrielsp20.github.io/gerador-field/

O endereço foi mantido para preservar o acesso aos dados existentes no `localStorage` do navegador.

## Funcionalidades

- Tipos de encerramento para situações recorrentes do Service Desk
- Modelos prontos que permanecem totalmente editáveis
- Geração e cópia do texto em uma única ação
- Edição do texto final antes da cópia
- Salvamento automático do rascunho
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

## Armazenamento e compatibilidade

Os dados continuam sendo armazenados somente no navegador. As chaves legadas `rascunhoField` e `historicoField` foram mantidas, e o antigo campo `testes` é recuperado como `Solução aplicada`, evitando perda dos dados já salvos.

## Autor

Desenvolvido por Gabriel.
