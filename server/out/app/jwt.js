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
exports.verifyToken = exports.createToken = void 0;
const jose = require("jose");
const staticSecret = '068d3b93-055f-4683-bd76-d1d80baa5a62';
const issuer = 'jtr:auction:issuer';
const audience = 'jtr:auction:audience';
const createToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = new TextEncoder().encode(staticSecret);
    const alg = 'HS256';
    const jwt = yield new jose.SignJWT({
        email
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setExpirationTime('2h')
        .sign(secret);
    return jwt;
});
exports.createToken = createToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = new TextEncoder().encode(staticSecret);
    const { payload } = yield jose.jwtVerify(token, secret, {
        issuer,
        audience
    });
    return payload;
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map