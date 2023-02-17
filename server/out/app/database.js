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
const client_1 = require("@prisma/client");
class ReadDatabase {
    constructor() {
        this.db = new client_1.PrismaClient();
    }
    get user() {
        return {
            all: () => this.db.user.findMany(),
            find: (id) => this.db.user.findFirst({
                where: {
                    id
                }
            }),
            check: (email) => __awaiter(this, void 0, void 0, function* () {
                return this.db.user.findFirst({
                    where: {
                        email
                    }
                });
            })
        };
    }
    get admin() {
        return {
            all: () => this.db.admin.findMany(),
            find: (id) => this.db.admin.findFirst({
                where: {
                    id
                }
            })
        };
    }
    get deposit() {
        return {
            all: () => __awaiter(this, void 0, void 0, function* () {
                return this.db.deposit.findMany();
            }),
            find: (id) => __awaiter(this, void 0, void 0, function* () {
                return this.db.deposit.findFirst({
                    where: {
                        id
                    }
                });
            }),
            allPending: () => __awaiter(this, void 0, void 0, function* () {
                return this.db.deposit.findMany({
                    where: {
                        accepted_at: undefined
                    }
                });
            }),
            allAccepted: () => __awaiter(this, void 0, void 0, function* () {
                return this.db.deposit.findMany({
                    where: {
                        accepted_at: {
                            not: undefined
                        }
                    }
                });
            })
        };
    }
}
class WriteDatabase {
    constructor() {
        this.db = new client_1.PrismaClient();
    }
    get user() {
        return {
            create: (email, name, password, salt) => this.db.user.create({
                data: {
                    email, password, balance: 0, salt, name
                }
            })
        };
    }
    get admin() {
        return {
            create: (username, password, salt) => this.db.admin.create({
                data: {
                    username, password, salt
                }
            })
        };
    }
    get deposit() {
        return {
            create: (user_id, amount) => this.db.deposit.create({
                data: {
                    user_id, amount
                }
            })
        };
    }
}
exports.default = {
    read: new ReadDatabase,
    write: new WriteDatabase
};
//# sourceMappingURL=database.js.map