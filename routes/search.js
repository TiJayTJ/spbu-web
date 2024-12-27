var express = require("express");
var router = express.Router();

/* GET search. */
router.get("/", function (req, res, next) {
  const query = req.query.query || "default query"; // Default
  const results = [...Array(10)].map((_, index) => ({
    title: `Результат ${index + 1}`,
    description: "Описание <b>asdfasafs</b>  ${index + 1}",
  }));
  res.render("search", { results, query });
});

module.exports = router;
