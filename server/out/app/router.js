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
exports.expressMiddleware = void 0;
const trpc = require("./trpc");
const trpcExpress = require("@trpc/server/adapters/express");
const database_1 = require("./database");
const zod_1 = require("zod");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const server_1 = require("@trpc/server");
const jwt = require("./jwt");
const trpcRouter = trpc.router({
    login: trpc.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string(), password: zod_1.z.string()
    }))
        .mutation((req) => __awaiter(void 0, void 0, void 0, function* () {
        const { input } = req;
        const user = yield database_1.default.read.user.check(input.email);
        if (user) {
            const hashPw = bcrypt.hashSync(input.password, user.salt);
            const token = yield jwt.createToken(user.email);
            if (hashPw === user.password)
                return {
                    token,
                    email: user.email,
                    balance: user.balance
                };
            else
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Incorrect password',
                });
        }
        else {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Email not found, please make sure email registered',
            });
        }
    })),
    register: trpc.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string()
    }))
        .mutation((req) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.input;
        const salt = bcrypt.genSaltSync();
        try {
            const user = yield database_1.default.write.user.create(email, email, bcrypt.hashSync(password, salt), salt);
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new server_1.TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Email already used, please choose another',
                        cause: error,
                    });
                }
            }
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred, please try again later.',
                cause: error,
            });
        }
    })),
    check: trpc.protectedProcedure
        .query((req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return database_1.default.read.user.check(req.ctx.email);
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred, please try again later.',
                cause: error,
            });
        }
    }))
});
exports.expressMiddleware = trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: trpc.createContext,
});
//# sourceMappingURL=router.js.map