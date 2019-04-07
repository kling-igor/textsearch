import {
  readdir,
  stat,
  ensureDir,
  mkdirp,
  readFile,
  writeFile
} from "fs-extra";

import { createReadStream } from "fs";
import { resolve, join, extname, basename, dirname } from "path";
import Fuse from "fuse.js";

const fileOptions = { encoding: 'utf-8' }

const projectPath = process.argv[2]
const query = process.argv[3]
const caseSensitive = JSON.parse(process.argv[4] || false)

const searchInFile = (filePath, query, searchOptions = {}) => {
  return new Promise((resolve, reject) => {
    let searchResult = [];

    const stream = createReadStream(filePath, fileOptions);

    stream.on("data", data => {
      const lines = data
        .split(/\n/)
        .map((text, line) => ({ text, line: line + 1 }));

      const fuse = new Fuse(lines, searchOptions);
      const results = fuse.search(query);
      searchResult = [...searchResult, ...results];
    });
    stream.on("close", () => {
      resolve({ file: basename(filePath), path: dirname(filePath), query, searchOptions, result: searchResult });
    });
  })
}

const search = async (folderPath, query, searchOptions = {}, recursionDepth = 0) => {
  const folderItems = await readdir(folderPath)

  for (const item of folderItems) {
    const itemPath = join(folderPath, item)
    const info = await stat(itemPath)

    if (info.isFile()) {
      const result = await searchInFile(itemPath, query, searchOptions)
      process.send({ ...result });
    }
    else if (info.isDirectory()) {
      await search(itemPath, query, searchOptions, recursionDepth + 1)
    }
  }

  if (recursionDepth === 0) {
    process.send({ status: 'ready', folderPath, query, searchOptions });
  }
}

const searchOptions = Object.assign({
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.3, // 0.6
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["text"]
}, { caseSensitive })


search(projectPath, query, searchOptions).then(() => {
  process.exit(0);
})


