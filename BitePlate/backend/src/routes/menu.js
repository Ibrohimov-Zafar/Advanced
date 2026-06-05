const express = require('express');
const router = express.Router();
const { menuItems, setMeals } = require('../utils/dataStore');

router.get('/', (req, res) => {
  const { category } = req.query;
  let items = [...menuItems, ...setMeals].map((i) => i.toJSON());
  if (category) {
    items = items.filter((i) => i.category === category);
  }
  res.json(items);
});

router.get('/categories', (req, res) => {
  const categories = [...new Set(menuItems.map((i) => i.category))];
  res.json(categories);
});

module.exports = router;
