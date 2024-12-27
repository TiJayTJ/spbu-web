const fs = require("fs");
const path = require("path");

const filesDir = process.env.FILES_PATH;

// Убедимся, что директория `files` существует
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Функция для скачивания анекдотов на русском
async function fetchRussianJokes() {
  const jokes = [];
  for (let i = 1; i <= 50; i++) {
    try {
      const response = await fetch(
        "https://v2.jokeapi.dev/joke/Any?lang=en&type=single&blacklistFlags=nsfw,racist,sexist,explicit"
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.joke) {
        jokes.push(data.joke);
        console.log(`Анекдот #${i} скачан.`);
      } else {
        console.error(`Не удалось получить анекдот #${i}`);
      }
    } catch (error) {
      console.error(`Ошибка при запросе анекдота #${i}: ${error.message}`);
    }
  }

  return jokes;
}

// Функция для сохранения анекдотов в файлы
async function saveJokesToFiles() {
  const jokes = await fetchRussianJokes();

  jokes.forEach((joke, index) => {
    const filePath = path.join(filesDir, `joke_${index + 1}.txt`);
    fs.writeFileSync(filePath, joke, "utf8");
    console.log(`Анекдот сохранён: ${filePath}`);
  });

  console.log(`Всего сохранено анекдотов: ${jokes.length}`);
}

// Выполняем
saveJokesToFiles().catch((error) => {
  console.error(`Произошла ошибка: ${error.message}`);
});
