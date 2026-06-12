import express from 'express'
import cors from 'cors'
import teamsRouter from './routes/teams'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors({ origin: 'https://mercado-fichajes-vlr.vercel.app' }))
app.use(express.json())
app.use('/api/teams', teamsRouter)

app.listen(Number(PORT), () => {
  console.log('Servidor corriendo en http://localhost:' + PORT)
})