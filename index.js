const fs = require("fs");

const getReviewsByPage = require("./getReviewsByPage");
const { sleep } = require("./utils");

const NUM_PAGES = 81;

const getReviews = async () => {
  const reviews = [];
  for (let i = 1; i <= NUM_PAGES; i++) {
    console.log(`...fetching page ${i}`);
    const newReviews = await getReviewsByPage(i);
    reviews.push(...newReviews);
    await sleep(200);
  }

  console.log(`\nFetched ${reviews.length} reviews from ${NUM_PAGES} page(s)`);
  return reviews;
};

const main = async () => {
  const reviews = await getReviews();
  const data = JSON.stringify({ data: reviews });
  fs.writeFileSync("reviews.json", data);
};

main();

// // For reading the json
// const rawdata = fs.readFileSync('reviews.json');
// const json = JSON.parse(rawdata);
// console.log(json.data.length);
