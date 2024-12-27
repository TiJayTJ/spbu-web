const fs = require("fs");
const path = require("path");

const filesDir = process.env.FILES_PATH;

const invertedIndex = {};

function buildIndex() {
  const files = fs.readdirSync(filesDir);

  files.forEach((file) => {
    const content = readContent(file);

    const words = content
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/gi, "")
      .split(/\s+/);

    words.forEach((word) => {
      if (!invertedIndex[word]) {
        invertedIndex[word] = new Set();
      }
      invertedIndex[word].add(file);
    });
  });

  for (const word in invertedIndex) {
    invertedIndex[word] = Array.from(invertedIndex[word]);
  }

  console.log("Файлы проиндексированы!");
}

function search(query) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => invertedIndex[word]);

  if (words.length === 0) {
    return [];
  }

  return words
    .map((word) => invertedIndex[word])
    .reduce((acc, files) => acc.filter((file) => files.includes(file)));
}

function readContent(fileName) {
  const filePath = path.join(filesDir, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Файл "${fileName}" не найден в директории "${filesDir}"`
      );
    }

    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Ошибка при чтении файла: ${error.message}`);
    return null;
  }
}

module.exports = {
  readContent,
  buildIndex,
  search,
};
