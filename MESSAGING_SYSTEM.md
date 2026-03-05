# Система повідомлень macOS Interface

## 📋 Опис

Реалізована повнофункціональна система обміну повідомленнями, яка інтегрується з існуючою системою реєстрації та аутентифікації. Користувачі можуть отримувати доступ до чату через застосунок Messages та спілкуватися один з одним в реальному часі.

## 🏗️ Архітектура

### 1. **БД (Database Layer)**

#### Таблиці:
- **conversations** - зберігає діалоги між двома користувачами
  - `id` - унікальний ID розмови
  - `participant_1_id` - ID першого учасника (завжди менший)
  - `participant_2_id` - ID другого учасника (завжди більший)
  - `created_at` - час створення
  - `updated_at` - час останнього оновлення

- **messages** - зберігає повідомлення
  - `id` - унікальний ID повідомлення
  - `conversation_id` - ID розмови
  - `sender_id` - ID відправника
  - `content` - текст повідомлення
  - `created_at` - час відправлення
  - `updated_at` - час редагування
  - `is_edited` - флаг редагування

#### Файл міграції:
```
supabase/migrations/create_conversations.sql
```

Містить:
- Створення таблиць
- Індекси для швидких запитів
- RLS (Row Level Security) політики для захисту даних

### 2. **Server Actions (Backend Logic)**

#### conversations-get.ts
```typescript
- getConversations() - отримати всі розмови поточного користувача
- getOrCreateConversation(userId) - отримати або створити розмову з користувачем
```

#### messages-get.ts
```typescript
- getMessages(conversationId, limit) - отримати повідомлення розмови
- sendMessage(conversationId, content) - відправити повідомлення
- deleteMessage(messageId) - видалити повідомлення
```

### 3. **Custom Hooks**

#### use-chat.ts
Управління станом чату на клієнті:
```typescript
- conversations - список розмов
- selectedConversationId - ID вибраної розмови
- messages - повідомлення
- isLoading - статус завантаження
- error - помилки
- handleSendMessage() - відправити повідомлення
- startConversation() - почати розмову з користувачем
- loadConversations() - оновити список розмов
- loadMessages() - оновити повідомлення
```

### 4. **React Components**

#### MessagesWindow.tsx
Основний компонент чату:
- **Ліва панель** - список розмов з пошуком
- **Центральна область** - переписка
- **Нижня панель** - введення повідомлень

Функції:
- Відображення всіх розмов користувача
- Пошук по імені учасника
- Відправлення повідомлень
- Автоматичне прокручування до нових повідомлень
- Відображення інформації про учасника
- Форматування часу (now, 5m, 2h, yesterday, etc.)

### 5. **Типи (TypeScript)**

#### chat.types.ts
```typescript
- Conversation - тип розмови
- Message - тип повідомлення
- ConversationWithUser - розмова з інформацією про учасника
- MessageWithProfile - повідомлення з інформацією про відправника
- ChatState - стан чату
```

## 🔒 Безпека

### RLS Політики:
1. **Conversations** - користувач бачить тільки свої розмови
2. **Messages** - користувач бачить тільки повідомлення своїх розмов
3. **Відправлення** - тільки автор може редагувати своє повідомлення

### Перевірки на сервері:
- Аутентифікація користувача
- Належність розмови користувачу
- Права власника на редагування

## 📁 Файлова структура

```
src/
├── actions/
│   ├── conversations-get.ts      (Server actions для розмов)
│   └── messages-get.ts           (Server actions для повідомлень)
├── components/
│   └── windows-layer/
│       └── messages-window/
│           ├── messages-window.tsx (Основний компонент)
│           └── index.ts
├── hooks/
│   └── use-chat.ts               (Custom hook для чату)
├── types/
│   └── chat.types.ts             (TypeScript типи)
└── utils/

supabase/
├── migrations/
│   └── create_conversations.sql  (SQL міграція)
└── types/
    └── database.types.ts         (Оновлені типи БД)
```

## 💻 Як це працює

### Потік даних:

1. **Завантаження сторінки**
   - `useChat()` hook викликає `getConversations()`
   - Завантажуються всі розмови користувача

2. **Вибір розмови**
   - Користувач клікає на розмову
   - `setSelectedConversationId()` оновлює вибір
   - `loadMessages()` завантажує повідомлення

3. **Відправлення повідомлення**
   - Користувач вводить текст і натискає Enter або кнопку
   - `handleSendMessage()` викликає `sendMessage()` на сервері
   - Сервер перевіряє права, зберігає повідомлення
   - Закінчується автоматичне оновлення розмов та повідомлень

4. **Real-time (можна додати)**
   - Можна підписатися на Supabase Realtime
   - Повідомлення будуть появлятися миттєво

## 🚀 Можливості для розширення

1. **Real-time messaging** - додати Supabase Realtime
2. **Друзі** - система друзів для легшого запуску чатів
3. **Групові чати** - розширити модель для N учасників
4. **Attach файлів** - завантаження  зображень та файлів
5. **Реакції** - емоджи-реакції на повідомлення
6. **Mention користувачів** - @username функціональність
7. **Видалення розмов** - архівування розмов
8. **Read receipts** - ознаки прочитання

## 🛠️ Встановлення в Supabase

1. Виконайте SQL міграцію:
```bash
supabase migration up
```

або вручну скопіюйте код з `create_conversations.sql` в Supabase SQL Editor

2. Переконайтесь, що поточна версія типів БД оновлена

## ✅ Тестування

Для тестування функціональності:

1. Зареєструйте двох користувачів
2. Користувач 1 відкриває Messages
3. Знаходит користувача 2 через якийсь механізм (контакти, пошук)
4. Започинає розмову
5. Отримує доступ до Messages зі свого прямого попередньо встановленого робочого столу

## 📝 Зміни у файлах

### Нові файли:
- `supabase/migrations/create_conversations.sql`
- `src/actions/conversations-get.ts`
- `src/actions/messages-get.ts`
- `src/hooks/use-chat.ts`
- `src/types/chat.types.ts`

### Оновлені файли:
- `src/components/windows-layer/messages-window/messages-window.tsx`
- `src/actions/index.ts` (додані експорти)
- `src/hooks/index.ts` (додані експорти)
- `src/types/index.ts` (додані експорти)
- `supabase/types/database.types.ts` (додані таблиці conversations і messages)
