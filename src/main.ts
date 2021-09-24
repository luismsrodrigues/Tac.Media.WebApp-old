/* eslint-disable no-prototype-builtins */
import { Application } from 'express';
import express from "express";
import path from 'path';
import dotenv from "dotenv";
import * as Controllers from "./controllers";
import { ErrorHandler } from "@/lib/handlers";
import Cors from "cors";

dotenv.config();

const PUBLIC_URL: string = process.env.PUBLIC_URL || '';
const PORT: string = process.env.API_PORT || '3000';
const isProduction: boolean = process.env.ENV != "development";

const app: Application = express();

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));

function Mount() {
  Object.values(Controllers).forEach(controller => {
    const t = new controller;
    t.Map(app);
  });

  app.use(ErrorHandler);

  if (isProduction) {
    app.use(
      PUBLIC_URL,
      express.static(path.resolve(__dirname, 'www'), { maxAge: Infinity })
    );

    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, './www/index.html'));
    });
  } else {
    app.use(Cors({ origin: "http://localhost:4333" }));
  }

  app.use('/temp', express.static(path.join(__dirname, '..', 'temp', 'banners')));
  app.use('/resources', express.static(path.join(__dirname, '..', 'resources')));

  app.listen(PORT, () => {
    console.log(
      '\x1b[34m',
      `${String.fromCodePoint(
        0x1f680
      )} Server has started running at http://localhost:${PORT}/ ${String.fromCodePoint(
        0x1f680
      )}`
    );
    const mode = isProduction ? "Production" : "Development";
    console.log("Started in " + mode + " Mode");
  });
}

Mount();

module.exports = app;
