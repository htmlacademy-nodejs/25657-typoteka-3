const { Router } = require(`express`);
const { getMockData } = require('../lib/get-mock-data');
const { CategoriesService, CommentsService, ArticlesService, SearchService } = require(`../data-service`);
const { categories } = require('./categories');
const { articles } = require('./articles');
const { search } = require('./search');

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  articles(app, new ArticlesService(mockData), new CommentsService());
  search(app, new SearchService(mockData));
})();

module.exports = app;
