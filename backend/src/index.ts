import express from 'express'
import cors from 'cors'
import teamsRouter from './routes/teams'

const app = express()
const PORT = process.env.PORT || 8080

// Orígenes permitidos: CORS_ORIGINS="https://a.com,https://b.com" o el de Vercel por defecto
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'https://mercado-fichajes-vlr.vercel.app')
  .split(',')
  .map(o => o.trim())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use('/api/teams', teamsRouter)

app.listen(Number(PORT), () => {
  console.log('Servidor corriendo en http://localhost:' + PORT)
})