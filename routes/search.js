var express = require("express");
var indexer = require("../lib/indexer");

var router = express.Router();

router.get("/", function (req, res, next) {
  const query = req.query.query || "";
  const fileEntries = indexer.search(query);

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word);

  const results = fileEntries.map((fileName) => {
    let highlightedContent = indexer.readContent(fileName);

    words.forEach((word) => {
      // Регулярное выражение для целых слов, включая русские буквы
      const wordRegex = new RegExp(
        `(?<![\\p{L}\\p{M}\\p{N}_])(${word})(?![\\p{L}\\p{M}\\p{N}_])`,
        "giu"
      );
      highlightedContent = highlightedContent.replace(wordRegex, "<b>$1</b>");
    });

    return {
      title: fileName,
      content: highlightedContent,
    };
  });

  res.render("search", { results, query });
});

module.exports = router;
