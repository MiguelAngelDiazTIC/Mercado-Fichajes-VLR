import Parser from 'rss-parser'

const parser = new Parser()

const LEAKERS: string[] = [
  // Añade aquí los usuarios de Twitter de los leakers
  // 'usuario1',
  // 'usuario2',
]

const NITTER_INSTANCE = 'https://nitter.net'

const seen = new Set<string>()

export async function checkFeeds(onNewTweet: (user: string, content: string) => void): Promise<void> {
  for (const user of LEAKERS) {
    try {
      const feed = await parser.parseURL(`${NITTER_INSTANCE}/${user}/rss`)
      for (const item of feed.items) {
        const id = item.guid || item.link || ''
        if (!id || seen.has(id)) continue
        seen.add(id)
        const content = item.contentSnippet || item.content || ''
        console.log(`[${user}] Nuevo tweet: ${content}`)
        onNewTweet(user, content)
      }
    } catch (err) {
      console.error(`Error leyendo RSS de ${user}:`, err)
    }
  }
}