const fs = require(`fs`).promises;
const FILENAME = `mock.json`;
let data = null;

module.exports.getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};
