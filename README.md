# movies-explorer-api

Репозиторий для API дипломной работы: авторизация и регистрация пользователей, операции с фильмами.

Адрес репозитория: https://github.com/MaxLogvinov/movies-explorer-api

# Ссылки на проект

IP 51.250.90.73

Адрес для запросов к API: http://api.diploma.maxlogvinov.nomoredomainsicu.ru/

# Роутинг API

- POST /signup - создаёт пользователя с переданными в теле email, password и name
- POST /signin - проверяет переданные в теле почту и пароль
- GET /users/me - возвращает информацию о пользователе (email и имя)
- PATCH /users/me - обновляет информацию о пользователе (email и имя)
- GET /movies - возвращает все сохранённые текущим пользователем фильмы
- POST /movies - создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
- DELETE /movies/\_id - удаляет сохранённый фильм по id
