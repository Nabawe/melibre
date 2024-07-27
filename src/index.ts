import * as CONSTS from './mod.js';
import 'dotenv/config';
import express from "express";
import type { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

console.log( CONSTS.Obj );

console.log( "Hello World Again" );

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
