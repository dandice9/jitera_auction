import * as jose from 'jose'

const staticSecret = '068d3b93-055f-4683-bd76-d1d80baa5a62'
const issuer = 'jtr:auction:issuer'
const audience = 'jtr:auction:audience'

export const createToken = async (email: string) => {
    const secret = new TextEncoder().encode(staticSecret)
    const alg = 'HS256'
    
    const jwt = await new jose.SignJWT({ 
        email
     })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('2h')
    .sign(secret)
    
    return jwt
}

export const verifyToken = async (token: string) => {
    const secret = new TextEncoder().encode(staticSecret)
    const { payload } = await jose.jwtVerify(token, secret, {
        issuer,
        audience
    })

    return payload
}