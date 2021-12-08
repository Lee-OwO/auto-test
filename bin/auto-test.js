#!/usr/bin/env node

const path = require("path");
const minimist = require("minimist");
const start = require("../lib/start");

const params = minimist(process.argv.slice(2));
const ignore = params.i;
const isNeedTest = ignore !== "test";
const isNeedGenerate = ignore !== "gen" && params.s && params.o;

let sourceDirPath = "",
  targetDirPath = "";

if (isNeedGenerate) {
  sourceDirPath = path.resolve(params.s);
  targetDirPath = path.resolve(params.o);
}

start({ sourceDirPath, targetDirPath, isNeedTest, isNeedGenerate });
