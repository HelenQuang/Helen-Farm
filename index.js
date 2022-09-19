//File system module
const fs = require("fs");

//http module
const http = require("http");

//URL module
const url = require("url");

////////////////////////////////
//FILE

//Blocking, synchronous way
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}.`;
// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File writen!");

//Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);

//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been compiled!");
//       });
//     });
//   });
// });

////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end(`<h1>Page not found</h1>`);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
