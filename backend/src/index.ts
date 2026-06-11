import express from 'express'
import cors from 'cors'
import teamsRouter from './routes/teams'

const app = express()
const PORT = 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/teams', teamsRouter)

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT)
})