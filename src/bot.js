require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// CONFIGURAÇÕES DO SUPABASE
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('ERRO: Variáveis SUPABASE_URL ou SUPABASE_KEY não encontradas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const { Client } = require('discord.js-selfbot-v13');

const client = new Client({ checkCerts: false });

let activeConfigs = {}; // Armazena as configs de cada usuário namemoria.

async function syncConfigs() {
  const { data, error } = await supabase
    .from('bot_settings')
    .select('*');

  if (error) return console.error('Erro ao sincronizar configs:', error);

  data.forEach(config => {
    activeConfigs[config.user_id] = config;
  });
}

client.on('ready', async () => {
  console.log(`Selfbot logado como ${client.user.tag}`);
  await syncConfigs();
  
  // Atualiza configurações a cada 30 segundos
  setInterval(syncConfigs, 30000);
});

client.on('messageCreate', async (message) => {
  const config = activeConfigs[message.author.id] || 
                Object.values(activeConfigs).find(c => c.guild_id === message.guildId);

  if (!config) return;

  // Lógica de Detecção de Fila (Exemplo: se a mensagem for "fila")
  if (message.content.toLowerCase() === 'fila') {
    const response = config.queue_message || 'Entre na fila e aguarde sua vez!';
    
    await message.channel.send(response);

    // Log de Atividade Recente no Supabase
    await supabase.from('bot_logs').insert({
      user_id: config.user_id,
      action: 'Resposta de Fila',
      details: `Enviado em ${message.guild.name}`,
      timestamp: new Date().toISOString()
    });

    if (config.mention_players) {
      await message.channel.send('@everyone');
    }
  }
});

// Atualização de Presença (Rich Presence)
async function updatePresence() {
  const configs = Object.values(activeConfigs);
  if (configs.length === 0) return;

  const mainConfig = configs[0]; // Pega a config do primeiro usuário ativo
  client.user.setActivity(mainConfig.presence_activity || 'Free Fire', { 
    type: 2 // Listening
  });
}

setInterval(updatePresence, 60000);

client.login('TOKEN_DO_USUARIO_VEM_DO_SUPABASE');
