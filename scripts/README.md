# Регистрация креаторов в контракте BaseTip

Этот скрипт регистрирует всех 10 тестовых креаторов в смарт-контракте BaseTip на Base Sepolia.

## 🚀 Быстрый старт

### 1. Подготовка

```bash
# Перейдите в папку со скриптом
cd scripts

# Установите зависимости
npm install
```

### 2. Настройка приватного ключа

**⚠️ ВАЖНО: Используйте только тестовый кошелек!**

1. Откройте файл `register-creators.js`
2. Найдите строку: `const OWNER_PRIVATE_KEY = '0xYOUR_TEST_PRIVATE_KEY_HERE';`
3. Замените на ваш приватный ключ тестового кошелька

```javascript
const OWNER_PRIVATE_KEY = '0x1234567890abcdef...'; // Ваш приватный ключ
```

### 3. Получение тестового ETH

Если у вас нет ETH на Base Sepolia:
- Перейдите на [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Подключите ваш кошелек
- Получите тестовый ETH

### 4. Запуск скрипта

```bash
npm run register
```

## 📋 Что делает скрипт

1. **Проверяет** настройки и приватный ключ
2. **Регистрирует** каждого креатора по очереди:
   - Alice Chen (Digital artist)
   - Bob Johnson (Music producer)
   - Charlie Smith (Web3 developer)
   - Diana Rodriguez (Gamer/streamer)
   - Eve Thompson (Abstract painter)
   - Frank Wilson (Jazz musician)
   - Grace Lee (Blockchain developer)
   - Henry Brown (Indie game developer)
   - Iris Davis (3D artist)
   - Jack Miller (Electronic music producer)

3. **Показывает** прогресс и результаты каждой транзакции
4. **Выводит** итоговую статистику

## 📊 Ожидаемый результат

```
🚀 Starting creator registration process...

👤 Регистрируем от адреса: 0x...
📋 Всего креаторов: 10

[1/10] Регистрируем: Alice Chen
  ⛽ Estimate gas: 150000
  📤 TX sent: https://base-sepolia.blockscout.com/tx/0x...
  ✅ Подтверждено в блоке 12345678
  ⛽ Gas used: 145000

...

📊 ИТОГОВАЯ СТАТИСТИКА:
✅ Успешно зарегистрировано: 10
❌ Ошибок: 0
⛽ Общий газ использован: 1450000
💰 Примерная стоимость: 0.000145 ETH

🎉 Процесс регистрации завершен!
```

## 🔧 Настройки

- **Сеть**: Base Sepolia (Chain ID: 84532)
- **RPC**: https://sepolia.base.org
- **Контракт**: 0x602306cE966CB42FA39f6463cb401e8aF1080eBD
- **Пауза между транзакциями**: 2 секунды

## ⚠️ Важные замечания

1. **Только тестовый кошелек** - никогда не используйте основной кошелек
2. **Приватный ключ** - держите в секрете, не коммитьте в Git
3. **Gas fees** - на Base Sepolia очень дешевые (копейки)
4. **Все креаторы** будут зарегистрированы на ваш адрес

## 🐛 Устранение неполадок

### Ошибка: "Insufficient funds"
- Получите больше тестового ETH с faucet

### Ошибка: "Transaction failed"
- Проверьте, что контракт существует и доступен
- Убедитесь, что вы на правильной сети (Base Sepolia)

### Ошибка: "Private key not set"
- Установите ваш приватный ключ в переменной `OWNER_PRIVATE_KEY`

## 📝 После регистрации

После успешной регистрации все креаторы будут доступны для получения чаевых в вашем приложении BaseTip!
