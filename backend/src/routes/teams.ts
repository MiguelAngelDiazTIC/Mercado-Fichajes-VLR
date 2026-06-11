import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

const router = Router()

const dataPath = path.join(__dirname, '..', '..', 'data')

const regions = ['teamsEmea', 'teamsAmer', 'teamsPACF', 'teamsCN', 'teamsSEL']

regions.forEach(region => {
  router.get('/' + region, (req: Request, res: Response) => {
    const filePath = path.join(dataPath, region + '.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    res.json(data)
  })
})

export default router