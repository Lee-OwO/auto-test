#!/usr/bin/env node

const path = require("path");
const minimist = require("minimist");
const docGenerater = require("../lib/docGenerater");

const params = minimist(process.argv.slice(2));
const sourceDirPath = path.resolve(params.s);
const targetPath = path.resolve(params.o);

docGenerater({ sourceDirPath, targetPath });
