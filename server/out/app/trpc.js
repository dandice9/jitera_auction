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
exports.protectedProcedure = exports.publicProcedure = exports.middleware = exports.router = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const jwt = require("./jwt");
const createContext = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    function getUserFromHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization) {
                const user = yield jwt.verifyToken(req.headers.authorization.split(' ')[1]);
                return user;
            }
            return null;
        });
    }
    const user = yield getUserFromHeader();
    return {
        user
    };
});
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            email: ctx.user.email,
        },
    });
});
exports.router = t.router;
exports.middleware = t.middleware;
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(isAuthed);
//# sourceMappingURL=trpc.js.map