
import * as trpc from './trpc'
import * as trpcExpress from '@trpc/server/adapters/express';
import Database from './database'
import { z } from 'zod';
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as jwt from './jwt'
import moment = require('moment');

const trpcRouter = trpc.router({
    login: trpc.publicProcedure
                .input(z.object(
                    {
                        email: z.string(), password: z.string()
                    }
                ))
                .mutation(async (req) => {
                    const { input } = req

                    const user = await Database.read.user.check(input.email)

                    if(user){
                        const hashPw = bcrypt.hashSync(input.password, user.salt)
                        const token = await jwt.createToken(user.email)

                        if(hashPw === user.password)
                            return {
                                token,
                                email: user.email,
                                balance: user.balance
                            }
                        else
                            throw new TRPCError({
                                code: 'BAD_REQUEST',
                                message: 'Incorrect password',
                            });
                    }
                    else {
                        throw new TRPCError({
                            code: 'NOT_FOUND',
                            message: 'Email not found, please make sure email registered',
                          });
                    }
                }),

    register: trpc.publicProcedure
                .input(z.object({
                    email: z.string(),
                    password: z.string()
                }))
                .mutation(async (req) => {
                    const { email, password } = req.input

                    const salt = bcrypt.genSaltSync()

                    try {
                        const user = await Database.write.user.create(email, email, bcrypt.hashSync(password, salt), salt)

                        return user
                    } catch (error) {
                        if(error instanceof Prisma.PrismaClientKnownRequestError){
                            if(error.code === 'P2002'){
                                throw new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message: 'Email already used, please choose another',
                                    // optional: pass the original error to retain stack trace
                                    cause: error,
                                    });
                            }
                        }

                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'An unexpected error occurred, please try again later.',
                            // optional: pass the original error to retain stack trace
                            cause: error,
                            });
                    }
                }),

    check: trpc.protectedProcedure
                .query(async (req) => {
                    try {
                        return Database.read.user.check(req.ctx.email)
                    } catch (error) {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'An unexpected error occurred, please try again later.',
                            // optional: pass the original error to retain stack trace
                            cause: error,
                            });
                    }
                }),

        deposit: trpc.protectedProcedure
                    .input(z.number())
                    .mutation(async (req) => {
                        try {
                            const { input } = req
                            const user = await Database.read.user.check(req.ctx.email)

                            if(user && user.id){

                                const pre_balance = user.balance
                                const post_balance = user.balance.add(input)

                                await Database.write.transaction([Database.write.deposit.create(user.id, input), Database.write.user.balanceUpdate(user.id, post_balance)])

                                return {
                                    pre_balance,
                                    post_balance,
                                    amount: input
                                }
                            }
                            else {
                                throw new TRPCError({
                                    code: 'NOT_FOUND',
                                    message: 'User not found, please sign in first.',
                                    });
                            }
                        } catch (error) {
                            throw new TRPCError({
                                code: 'INTERNAL_SERVER_ERROR',
                                message: 'An unexpected error occurred, please try again later.',
                                // optional: pass the original error to retain stack trace
                                cause: error,
                                });
                        }
                    }),
    
    openListing: trpc.protectedProcedure
                        .query(async () => {
                            const openList = await Database.read.item.allOpen()
                            
                            return openList.map(item => {
                                const remaining = moment(item.bid_end_at).diff(moment(), 'minute')
                                const hd = Math.floor(remaining / 60)
                                const md = remaining % 60

                                return {
                                    id: item.id,
                                    name: item.name,
                                    description: item.description,
                                    price: item.bid_price,
                                    duration: `${hd}hr ${md}min`,
                                    closed_at: Date.now()
                                }
                            })
                        }),
    
    completedListing: trpc.protectedProcedure
                        .query(async () => {
                            const closedList = await Database.read.item.allClosed()
                            
                            return closedList.map(item => {
                                const remaining = moment().diff(moment(item.bid_end_at), 'minute')
                                const hd = Math.floor(remaining / 60)
                                const md = remaining % 60

                                return {
                                    id: item.id,
                                    name: item.name,
                                    description: item.description,
                                    price: item.bid_price,
                                    duration: `${hd}hr ${md}min ago`,
                                    closed_at: Date.now()
                                }
                            })
                        }),

    addItem: trpc.protectedProcedure
                        .input(z.object({
                            name: z.string(),
                            description: z.string(),
                            base_price: z.number(),
                            bid_start_at: z.number(),
                            bid_end_at: z.number()
                        }))
                        .mutation(async (req) => {
                            const { input } = req
                            const {
                                name,
                                description,
                                base_price,
                                bid_start_at,
                                bid_end_at
                            } = input

                            try {
                                return Database.write.bid.register(name,
                                    description,
                                    base_price,
                                    bid_start_at,
                                    bid_end_at
                                )
                            } catch (error) {
                                throw new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message: 'An unexpected error occurred, please try again later.',
                                    // optional: pass the original error to retain stack trace
                                    cause: error,
                                    });
                            }
                        }),

    bidItem: trpc.protectedProcedure
                        .input(z.object({
                            id: z.number(),
                            bid_price: z.number()
                        }))
                        .mutation(async (req) => {
                            const { input, ctx } = req
                            const {
                                id,
                                bid_price
                            } = input

                            try {
                                const item = await Database.read.item.find(id)
                                const user = await Database.read.user.check(ctx.email)

                                if(!item) {
                                    throw new Error('item not found')
                                }
                                if(item.bid_price.sub(bid_price).toNumber() > 0){
                                    throw new Error('bid must be higher')
                                }
                                if(!user){
                                    throw new Error('please sign in first')
                                }
                                if(user.balance.sub(bid_price).toNumber() < 0){
                                    throw new Error('insufficient credit value')
                                }

                                return Database.write.bid.call(id, bid_price, user)
                            } catch (error) {
                                if(error instanceof Error){
                                    throw new TRPCError({
                                        code: 'INTERNAL_SERVER_ERROR',
                                        message: error.message,
                                        });
                                }
                                
                                throw new TRPCError({
                                    code: 'INTERNAL_SERVER_ERROR',
                                    message: 'An unexpected error occurred, please try again later.',
                                    // optional: pass the original error to retain stack trace
                                    cause: error,
                                    });
                            }
                        })
})
export const expressMiddleware = trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: trpc.createContext,
})

export type AppRouter = typeof trpcRouter;