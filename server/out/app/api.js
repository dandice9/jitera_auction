"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressMiddleware = void 0;
const trpc = require("./trpc");
const trpcExpress = require("@trpc/server/adapters/express");
const trpcRouter = trpc.router({
    greeting: trpc.publicProcedure
        .input((val) => {
        if (typeof val === 'string')
            return val;
        throw new Error(`expected string value, ${typeof val} given`);
    })
        .query((req) => {
        const { input } = req;
        return `hello ${input}`;
    })
});
exports.expressMiddleware = trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: trpc.createContext,
});
//# sourceMappingURL=api.js.map