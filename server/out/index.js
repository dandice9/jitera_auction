"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router_1 = require("./app/router");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("./app/jwt");
dotenv.config();
const app = express();
app.use('/trpc', cors(), router_1.expressMiddleware);
app.get('/ping', (req, res) => {
    return res.send('pong!');
});
app.get('/jwt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt.createToken('dandice9@gmail.com');
    const payload = yield jwt.verifyToken(token);
    return res.json(payload);
}));
const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT).on('listening', () => {
    console.log(`listen at port ${APP_PORT}`);
});
//# sourceMappingURL=index.js.map