import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as jwt from './jwt'

export const createContext = async ({
    req
  }: trpcExpress.CreateExpressContextOptions) => {
    async function getUserFromHeader() {
      if (req.headers.authorization) {
        const user = await jwt.verifyToken(
          req.headers.authorization
        );
        return user;
      }
      return null;
    }
    const user = await getUserFromHeader();
  
    return {
      user
    }
  };
export type Context = inferAsyncReturnType<typeof createContext>;

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      email: ctx.user.email as string,
    },
  });
});
 
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed)