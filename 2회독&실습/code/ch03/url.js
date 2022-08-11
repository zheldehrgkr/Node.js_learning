const url = require('url');
const querystring = require('querystring');

const { URL } = url;

const myURL = new URL(
  'https://ticket.melon.com/performance/index.htm?prodId=206877'
);

const parsedUrl = url.parse(
  'https://ticket.melon.com/performance/index.htm?prodId=206877'
);

console.log(myURL);
console.log(parsedUrl);

console.log(url.format(myURL));
console.log(url.format(parsedUrl));

console.log(myURL.searchParams.get('prodId'));

const query = querystring.parse(parsedUrl.query);

console.log(query);
console.log(querystring.stringify(query));
