# Развёртывание PantOS Lab

Сайт можно развернуть бесплатно на **Vercel** (рекомендуется) или **Netlify**.

---

## Вариант 1: Vercel (через CLI)

1. **Установите Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Соберите и задеплойте**
   ```bash
   npm run build
   vercel
   ```

3. При первом запуске:
   - войдите в аккаунт (через браузер или email);
   - подтвердите настройки (проект, директория, команда сборки);
   - Vercel выдаст URL вида `https://your-project.vercel.app`.

4. **Продакшен**
   ```bash
   vercel --prod
   ```

---

## Вариант 2: Vercel через GitHub

1. Залить проект на GitHub.
2. Зайти на [vercel.com](https://vercel.com) → **Add New Project** → Import из GitHub.
3. Снаряды: Vercel сам определит Vite.
4. Нажать **Deploy** — после сборки появится ссылка на сайт.

---

## Вариант 3: Netlify

1. Собрать проект: `npm run build`
2. Зайти на [netlify.com](https://netlify.com) → **Add new site** → **Deploy manually**
3. Перетащить папку `dist` в окно загрузки.

Или через CLI: `npm i -g netlify-cli` → `netlify deploy --prod --dir=dist`

---

## Важно

- Сборка: `npm run build`
- Результат сборки: папка `dist`
- После деплоя пользователи смогут открыть сайт по ссылке
