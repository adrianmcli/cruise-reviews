const cheerio = require("cheerio");
const { getPage } = require("./utils");

const BASE_REVIEWS_URL =
  "https://www.cruisecritic.com/memberreviews/getreviews.cfm?action=ship&ShipID=73";
const REVIEW_LINK_SELECTOR =
  "a.member-review-list-item__review-text-link.chevron-after";

// helper fn to grab review ID from relative link
const relLinkToId = str =>
  str.match(/\/memberreviews\/memberreview\.cfm\?EntryID=(\d+)/)[1];

const getReviewsByPage = async pageNum => {
  // build url
  const suffix = pageNum === 1 ? "" : `&page=${pageNum}`;
  const url = BASE_REVIEWS_URL + suffix;

  // grab page and parse for relevant anchor tags
  const rawPage = await getPage(url);
  const $ = cheerio.load(rawPage);
  const res = $(REVIEW_LINK_SELECTOR);

  // filter out non-relevant tags and map for an array with just the data
  const reviewsRaw = Object.entries(res)
    .filter(([key, _]) => Number(key).toString() !== "NaN")
    .map(([_, data]) => data);

  // since we grab 2 anchor tags per review (1 for id, 1 for full text), let's merge them
  const reviews = [];
  reviewsRaw.forEach((item, idx) => {
    const isFullTextDiv = item.attribs.href === "#";

    if (isFullTextDiv) {
      if (idx === 0) return;
      const prev = reviews[reviews.length - 1];
      prev.fullText = item.prev.data;
    } else {
      reviews.push({
        id: relLinkToId(item.attribs.href),
        link: `https://www.cruisecritic.com${item.attribs.href}`,
      });
    }
  });

  return reviews;
};

module.exports = getReviewsByPage;
