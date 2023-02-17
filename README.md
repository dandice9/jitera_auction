# Jitera Auction

## System Requirements
- PostgreSQL Server
- Node JS 14.x or higher


## Setup
```
git clone git@github.com:dandice9/jitera_auction.git
cd jitera_auction
cd frontend && npm install
cd ../server && npm install
cp .env.example .env
```
edit .env and configure 
```
npx prisma migrate dev
```

## Local debugging
backend server:
`cd server && npm run dev`
open http://localhost:4000 or any port configured in .env

or can be executed via visual studio code debugger: https://code.visualstudio.com/docs/typescript/typescript-debugging

frontend server:
`cd frontend && npm run dev`
open http://localhost:3000

