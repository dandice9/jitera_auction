import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import * as moment from 'moment'

class ReadDatabase{
    private db = new PrismaClient()

    get user(){
        return {
            all: () => this.db.user.findMany(),
            find: (id: number) => this.db.user.findFirst({
                where: {
                    id
                }
            }),
            check: async (email: string) => this.db.user.findFirst({
                where: {
                    email
                }
            })
        }
    }

    get deposit(){
        return {
            all: async () => {
                return this.db.deposit.findMany()
            },
            find: async (id: number) => this.db.deposit.findFirst({
                where: {
                    id
                }
            })
        }
    }

    get item(){
        return {
            all: async () => {
                return this.db.bidItem.findMany()
            },
            find: async (id: number) => this.db.bidItem.findFirst({
                where: {
                    id
                }
            }),
            allOpen: async () => this.db.bidItem.findMany({
                where: {
                    bid_start_at: {
                        lte: moment().toDate()
                    },
                    bid_end_at: {
                        gte: moment().toDate()
                    }
                },
                orderBy: {
                    bid_end_at: 'asc'
                }
            }),
            allClosed: async () => this.db.bidItem.findMany({
                where: {
                    bid_end_at: {
                        lte: moment().toDate()
                    }
                },
                orderBy: {
                    bid_end_at: 'asc'
                }
            })
        }
    }
}

class WriteDatabase{
    private db = new PrismaClient()

    async transaction(transactionList: Array<any>){
        return this.db.$transaction(transactionList)
    }

    get user(){
        return {
            create: (email: string, name: string, password: string, salt: string) => this.db.user.create({
                data: {
                    email, password, balance: 0, salt, name
                }
            }),
            balanceUpdate: (id: number, balance: Decimal) => this.db.user.update({
                where: {
                    id
                },
                data: {
                    balance
                }
            })
        }
    }

    get deposit(){
        return {
            create: (user_id: number, amount: number) => this.db.deposit.create({
                data: {
                    user_id, amount
                }
            })
        }
    }

    get bid(){
        return {
            register: (
                name: string,
                description: string,
                base_price: number,
                bid_start_at: number,
                bid_end_at: number) => {
                
                return this.db.bidItem.create({
                    data: {
                        name,
                        description,
                        base_price,
                        bid_price: base_price,
                        bid_start_at: moment(bid_start_at).toDate(),
                        bid_end_at: moment(bid_end_at).toDate(),
                        is_completed: false
                    }
                })
            }
        }
    }
}

export default {
    read: new ReadDatabase,
    write: new WriteDatabase
}