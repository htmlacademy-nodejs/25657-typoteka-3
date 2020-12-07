'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { MAX_ID_LENGTH } = require('../constants');
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);

const FILE_NAME = `mock.json`;
const MAXIMUM_NUMBER_ANNOUNCEMENTS = 5;
const MAXIMUM_NUMBER_MONTHS = 3;
const MAX_COMMENTS = 4;

const MockElements = {
  min: 1,
  max: 1000,
};

const getPreviousDate = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return new Date(date);
};

const readFileInfo = async (fileName) => {
  try {
    return (await fs.readFile(fileName, `utf-8`)).split(/\n/).filter(str => str !== '');
  } catch (error) {
    return console.error(chalk.red(`Can't read file ${fileName}`));
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
  }))
);

const generateOffers = async (count) => {
  const titles = await readFileInfo('data/titles.txt');
  const announcements = await readFileInfo('data/announcements.txt');
  const categories = await readFileInfo('data/categories.txt');
  const comments = await readFileInfo('data/comments.txt');
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: new Date(getRandomInt(getPreviousDate(MAXIMUM_NUMBER_MONTHS), Date.now())),
    announce: shuffle(announcements).slice(0, getRandomInt(1, MAXIMUM_NUMBER_ANNOUNCEMENTS)).join(` `),
    fullText: shuffle(announcements).slice(0, getRandomInt(1, announcements.length - 1)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Math.max(parseInt(count, 10) || MockElements.min, MockElements.min);
    if (countOffer > MockElements.max) {
      return console.info(`Не больше 1000 публикаций`);
    }
    const content = JSON.stringify(await generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      return console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      return console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
