# shri-ci-server ![](https://img.shields.io/badge/SHRI-2021-informational) [![Node.js CI](https://github.com/i-kosh/shri-ci-server/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/i-kosh/shri-ci-server/actions/workflows/node.js.yml)

> Для запуска сборки и сервера требуется **nodejs 14** и выше

## Замечания по работе приложения

- для того, чтобы задания работали, в поле названия репозитория необходимо указывать название репозитория в формате `%имя_пользователя%/%название_репозитория%`
- для тестирования вывода ошибок достаточно указать невалидную ссылку

## Тесты

> Тесты запускаются скриптами из `package.json`

### Подготовка к запуску тестов с hermione

- Установить и запустить [selenium-standalone](https://github.com/gemini-testing/hermione#prerequisites) согласно инструкции
- При необходимости указать URL для запупущенного сервера selenium в `.env`
- Сбилдить сервер и клиент командой `npm run build` и запустить `npm run start`
- Выполнить `npm run hermione`

## Метрики

Чтобы посмотреть метрики нужно:

- Сбилдить сервер и клиент командой `npm run build` и запустить `npm run start`
- Перейти на страницу `/metrics`

# Инфраструктура

> Решил собирать сервер и агент вебпаком что бы не тащить пол гига модулей в контейнер, не знаю насколько это норм идея, но работает

## Как запустить контейнеры

1. Установить зависимости `npm i`
1. Выполнить `npm run build:docker`

   Далее можно запускать созданные образы руками передав необходимые переменные окружения (доступные переменные есть в `.env.example`)

   Или запустить все с помощью `docker-compose` перед этим создав файл `.env` по примеру из `.env.example` или заполнив переменные руками в `docker-compose.yml`. Выполнить `docker-compose up`. Если в конфиге ничего не менять контейнер сервера будет доступен на порту `3030`

> Таски запускаются не сразу, а с некоторой задержкой т.к сервер собирает задания раз в 1 минуту (по умолчанию)

## Обработка крайних случаев

Если агент неожиданно умирает:

1. Перед закрытием пытается сообщить об этом серверу
1. Если у агента нет возможности отправить сообщение серверу или он завис, отключили свет и т.п на этот случай есть механизм на сервере который предписывает агентам своевременно отмечаться, если агент слишком долго не отмечался он сначало просто помещается в очередь для ожидания, и если за время нахождения там он не вышел на связь, сервер его забывает

Если агент не может зарегистрироваться на сервере:

1. Он ретраит попытки зарегаться
2. Если не получилось - закрывается

Если агент не может сообщить результат сборки:

1. Опять же ретраит попытки
2. Завершает свой процесс с выводом ошибки в консоль, если не получилось

Что делает сервер если агент умер во время выполнения билда:

1. Сначало ждет пока агент будет объявлен как мертвый за счет механизма с хелсчеками
1. Если билд был поставлен в статус inProgress ставим этот билд опять в очередь (до трех раз)
1. Если все попытки были так-же провалены явно отменяет билд

### Необработанные крайние случаи

1. Если сервер был перезапущен - он забывает всех агентов. Но агенты про него помнят и пытаются отправлять хелсчеки и результаты билдов - серверх их не примет (Хотя возможно это норм поведение, не знаю)
1. Наверняка еще что-то забыл, в голову ничего не идет
