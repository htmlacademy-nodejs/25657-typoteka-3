const { Router } = require(`express`);
const { HttpCode } = require(`../constants`);
const { articleExist } = require(`../middlewares/article-exist`);
const { articleValidator } = require(`../middlewares/article-validator`);
const { commentExist } = require('../middlewares/comment-exist');
const { commentValidator } = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports.articles = (app, articlesService, commentsService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(articlesService), (req, res) => {
    const { articleId } = req.params;
    const article = articlesService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articlesService.create(req.body);
    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [articleValidator, articleExist(articlesService)], (req, res) => {
    const { articleId } = req.params;
    const updatedArticle = articlesService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExist(articlesService), (req, res) => {
    const { articleId } = req.params;
    const article = articlesService.drop(articleId);

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articlesService), (req, res) => {
    const { article } = res.locals;
    const comments = commentsService.findAll(article);

    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(articlesService), commentExist(commentsService)], (req, res) => {
    const { article, commentId } = res.locals;
    const comment = commentsService.drop(article, commentId);

    return res.status(HttpCode.OK).json(comment);
  });

  route.post(`/:articleId/comments`, [articleExist(articlesService), commentValidator], (req, res) => {
    const { article } = res.locals;
    const comment = commentsService.create(article, req.body);
    return res.status(HttpCode.CREATED).json(comment);
  });
};
