import * as express from 'express'
import { expressMiddleware } from './app/router'
import * as cors from 'cors'
import * as dotenv from 'dotenv'

import * as jwt from './app/jwt'

dotenv.config()

const app = express();

app.use(
    '/api/trpc', cors(), expressMiddleware
);

app.get('/api/ping', (req, res) => {
    return res.send('pong!')
})

app.get('/jwt', async (req, res) => {
    const token = await jwt.createToken('dandice9@gmail.com')
    const payload = await jwt.verifyToken(token)

    return res.json(payload)
})

const APP_PORT = process.env.APP_PORT
app.listen(APP_PORT).on('listening', () => {
    console.log(`listen at port ${APP_PORT}`)
});