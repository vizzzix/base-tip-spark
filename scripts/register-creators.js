import { createPublicClient, createWalletClient, http, privateKeyToAccount } from 'viem';
import { baseSepolia } from 'viem/chains';

// Конфигурация
const CHAIN = baseSepolia;
const RPC = 'https://sepolia.base.org';
const CONTRACT = '0x602306cE966CB42FA39f6463cb401e8aF1080eBD';

// ABI для функции registerCreator
const baseTipAbi = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'bio', type: 'string' },
      { internalType: 'string', name: 'avatar', type: 'string' }
    ],
    name: 'registerCreator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

// Данные креаторов для регистрации
const creators = [
  {
    name: 'Alice Chen',
    bio: 'Digital artist creating beautiful NFTs and illustrations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Bob Johnson',
    bio: 'Electronic music producer and DJ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Charlie Smith',
    bio: 'Full-stack developer building the future of web3',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Diana Rodriguez',
    bio: 'Professional gamer and streamer specializing in FPS games',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Eve Thompson',
    bio: 'Abstract painter exploring the intersection of technology and art',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Frank Wilson',
    bio: 'Jazz musician and composer creating ambient soundscapes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Grace Lee',
    bio: 'Blockchain developer and DeFi protocol architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Henry Brown',
    bio: 'Indie game developer creating pixel art adventures',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Iris Davis',
    bio: 'Digital sculptor and 3D artist pushing creative boundaries',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iris&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  {
    name: 'Jack Miller',
    bio: 'Electronic music producer and sound designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  }
];

// ⚠️ ВАЖНО: Замените на ваш приватный ключ тестового кошелька
const OWNER_PRIVATE_KEY = '0xYOUR_TEST_PRIVATE_KEY_HERE';

async function main() {
  console.log('🚀 Starting creator registration process...\n');

  // Проверяем, что приватный ключ установлен
  if (OWNER_PRIVATE_KEY === '0xYOUR_TEST_PRIVATE_KEY_HERE') {
    console.error('❌ ОШИБКА: Установите ваш приватный ключ в переменной OWNER_PRIVATE_KEY');
    console.log('📝 Получите тестовый ETH на https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
    process.exit(1);
  }

  const publicClient = createPublicClient({ 
    chain: CHAIN, 
    transport: http(RPC) 
  });
  
  const account = privateKeyToAccount(OWNER_PRIVATE_KEY);
  const walletClient = createWalletClient({ 
    account, 
    chain: CHAIN, 
    transport: http(RPC) 
  });

  console.log(`👤 Регистрируем от адреса: ${account.address}`);
  console.log(`📋 Всего креаторов: ${creators.length}\n`);

  let totalGasUsed = 0n;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < creators.length; i++) {
    const { name, bio, avatar } = creators[i];
    
    try {
      console.log(`[${i + 1}/${creators.length}] Регистрируем: ${name}`);
      
      // Оценка газа
      const gas = await publicClient.estimateContractGas({
        address: CONTRACT,
        abi: baseTipAbi,
        functionName: 'registerCreator',
        args: [name, bio, avatar],
        account: account.address,
      });
      
      console.log(`  ⛽ Estimate gas: ${gas.toString()}`);
      
      // Отправка транзакции
      const hash = await walletClient.writeContract({
        address: CONTRACT,
        abi: baseTipAbi,
        functionName: 'registerCreator',
        args: [name, bio, avatar],
      });
      
      console.log(`  📤 TX sent: https://base-sepolia.blockscout.com/tx/${hash}`);
      
      // Ожидание подтверждения
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        console.log(`  ✅ Подтверждено в блоке ${receipt.blockNumber}`);
        console.log(`  ⛽ Gas used: ${receipt.gasUsed.toString()}`);
        totalGasUsed += receipt.gasUsed;
        successCount++;
      } else {
        console.log(`  ❌ Транзакция провалилась`);
        failCount++;
      }
      
      console.log(''); // Пустая строка для читаемости
      
      // Небольшая пауза между транзакциями
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`  ❌ Ошибка при регистрации ${name}:`, error.message);
      failCount++;
      console.log('');
    }
  }

  // Итоговая статистика
  console.log('📊 ИТОГОВАЯ СТАТИСТИКА:');
  console.log(`✅ Успешно зарегистрировано: ${successCount}`);
  console.log(`❌ Ошибок: ${failCount}`);
  console.log(`⛽ Общий газ использован: ${totalGasUsed.toString()}`);
  
  // Оценка стоимости (примерная)
  try {
    const gasPrice = await publicClient.getGasPrice();
    const totalCost = totalGasUsed * gasPrice;
    console.log(`💰 Примерная стоимость: ${(Number(totalCost) / 1e18).toFixed(6)} ETH`);
  } catch (error) {
    console.log('💰 Не удалось получить цену газа для расчета стоимости');
  }
  
  console.log('\n🎉 Процесс регистрации завершен!');
}

main().catch((error) => {
  console.error('💥 Критическая ошибка:', error);
  process.exit(1);
});
