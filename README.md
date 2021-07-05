# shri-ci-server

## Замечания по работе приложения

- для того, чтобы сборка работала, в поле названия репозитория необходимо указывать название репозитория в формате `%имя_пользователя%/%название_репозитория%`
- для тестирования вывода ошибок достаточно указать невалидную ссылку

## Тесты

> Тесты запускаются скриптами из `package.json`

- `src/server/Repo.ts` - Модуль для управления репозиторием
  - Так как большинство методов класса не имеют сложной внутренней логики, а просто вызывают команды гита, кажется что нет смысла покрывать их юнит тестами, вместо этого буду тестировать интеграционными тестами на реальном репозитории
- `src/server/ServerError.ts` - Класс для генерации ошибок во вермя выполения контроллеров, для удобного последующего проброса их на фронт
  - Просто юнит тесты

### Подготовка к запуску тестов с hermione

- Установить и запустить [selenium-standalone](https://github.com/gemini-testing/hermione#prerequisites) согласно инструкции
- При необходимости указать URL для запупущенного сервера selenium в `.env`
- Сбилдить сервер и клиент командой `npm run build` и запустить `npm run start`
- Выполнить `npm run hermione`
