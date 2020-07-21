# Mapping GoBarber features

## Recuperação de senha

- RF
  - [ ] O usuário deve poder solicitar a recuperação de senha informando o seu e-mail
  - [ ] O usuário deve receber um e-mail com instruções para recuperação de senha
  - [ ] O usuário deve poder resetar sua senha seguindo as intruções de recuperação

- RNF
  - [ ] Utilizar o Mailtrap para testar envios de e-mail em ambiente de desenvolvimento
  - [ ] Utilizar o Amason SES para envios de e-mail em produção
  - [ ] O envio de e-mails deve acontecer em segundo plano (background job)

- RN
  - [ ] O link enviado por e-mail para resetar a senha deve expirar em 2 horas
  - [ ] O usuário precisa confirmar a nova senha para proceder com o reset

## Atualização do perfil

- RF
  - [ ] O usuário deve poder atualizar seu nome, e-mail e senha

- RN
  - [ ] O usuário não pode alterar seu e-mail para um e-mail já utilizado
  - [ ] Para atualizar sua senha o usuário deve informar a senha antiga
  - [ ] Para atualizar sua senha o usuário precisa confirmar a nova senha

## Painel do prestador

- RF
  - [ ] O usuário deve poder listar seus agendamentos de um dia específico
  - [ ] O prestador deve receber uma notificação sempre que houver um novo agendamento
  - [ ] O prestador deve poder visualizar as notificações não lidas

- RNF
  - [ ] Os agendamentos do prestador no dia devem ser armazenados em cache
  - [ ] As notificações do prestador devem ser armazenadas no MongoDB
  - [ ] As notificações do prestador devem ser enviadas em tempo-real utilizando o Socket.io

- RN
  - [ ] A notificação deve ter um status de lida ou não lida para que o prestador possa controlar as mensagens que já visualizou

## Agendamento de serviços

- RF
  - [ ] O usuário deve poder listar todos os prestadores de serviço cadastrados
  - [ ] O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador
  - [ ] O usuário deve poder listar horários disponíveis em um dia específico de um prestador
  - [ ] O usuário deve poder realizar um novo agendamento com um prestador

- RNF
  - [ ] A listagem de prestadores deve ser armazenada em cache

- RN
  - [ ] Cada agendamento deve durar 1 hora extamente
  - [ ] Os agendamentos devem estar disponíveis de 8h às 18h (primeiro às 8h e último as 17h)
  - [ ] O usuário não pode agendar em um horário já ocupado
  - [ ] O usuário não pode agendar em um horário que já passou
  - [ ] O usuário não pode agendar serviços consigo mesmo

----

## Legenda

> RF = Requisitos funcionais
>
> RNF = Requisitos não funcionais
>
> RN = Regras de negócio
