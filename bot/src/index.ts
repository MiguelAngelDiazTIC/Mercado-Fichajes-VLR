import 'dotenv/config'
import { Client, GatewayIntentBits, Message } from 'discord.js'
import { checkFeeds } from './rss'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || ''
const CHANNEL_ID = '1514997401650335988'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once('clientReady', () => {
  console.log('Bot conectado como ' + client.user?.tag)

  // Chequea RSS cada 5 minutos
  checkFeeds(handleTweet)
  setInterval(() => checkFeeds(handleTweet), 5 * 60 * 1000)
})

client.on('messageCreate', async (message: Message) => {
  if (message.channelId !== CHANNEL_ID) return
  if (message.author.bot) return
  console.log('Mensaje recibido:', message.content)
})

function handleTweet(user: string, content: string): void {
  console.log(`Tweet de ${user}: ${content}`)
  // Aquí procesaremos el tweet y actualizaremos los JSON
}

client.login(DISCORD_TOKEN)