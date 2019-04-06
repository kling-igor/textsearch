import {
  readdir,
  stat,
  ensureDir,
  mkdirp,
  readFile,
  writeFile
} from "fs-extra";

import { createReadStream } from "fs";
import { resolve, join, extname } from "path";
import Fuse from "fuse.js";

const fileOptions = { encoding: 'utf-8' }

const projectPath = process.argv[2]

// setInterval(() => {
//   process.send({ details: 'I`m alive!!!' });
// }, 2000)



// https://fusejs.io/


// const file = resolve(__dirname, "sometext.txt");

const searchOptions = {
  caseSensitive: true,
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["text"]
};

/*
const query = "end";

const searchTextPromise = new Promise((resolve, reject) => {
  let searchResult = [];

  const stream = createReadStream(file, { encoding: "utf8" });
  stream.on("data", data => {
    const lines = data
      .split(/\n/)
      .map((text, line) => ({ text, line: line + 1 }));

    const fuse = new Fuse(lines, searchOptions);
    const results = fuse.search(query);
    searchResult = [...searchResult, ...results];
  });
  stream.on("close", () => {
    resolve(searchResult);
  });
});
*/
// searchTextPromise
//   .then(result => {
//     result.forEach(item => {
//       console.log(JSON.stringify(item));
//     });
//   });

; (async () => {
  const folderItems = await readdir(projectPath)

  console.log(folderItems)

})()
// doSomeAsyncWork(projectPath, query)
//   .then(() => {
//     process.send({ status: 'ready' });
//   })
//   .catch(e => {
//     process.send({ status: 'error', details: e });
//   })