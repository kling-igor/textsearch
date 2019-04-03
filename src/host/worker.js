import "@babel/polyfill";

import {
  readdir,
  stat,
  ensureDir,
  mkdirp,
  readFile,
  writeFile
} from "fs-extra";

import { join, extname } from "path";

const projectPath = process.argv[2]

doSomeAsyncWork(projectPath, query)
  .then(() => {
    process.send({ status: 'ready' });
  })
  .catch(e => {
    process.send({ status: 'error', details: e });
  })