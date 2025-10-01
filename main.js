const fs = require("fs");
const http = require("http");
const https = require("https");
const { stdout } = require("process");
const urlModule = require("url");
const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Error: URLs array is empty. Please provide URLs to download.");
  process.exit(1);
}

urls.forEach((url) => {
  const protocol = url.startsWith("https") ? https : http;
  const options = { method: "GET", headers: { "User-Agent": "Mozilla/5.0" } };

  protocol
    .get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const parsedUrl = urlModule.parse(url);
        const hostname = parsedUrl.hostname;
        const filename = `${hostname}.html`;
        fs.writeFile(filename, data, (err) => {
          if (err) {
            console.error(`Error writing ${filename}: ${err}`);
          } else {
            console.log(`Downloaded ${url} to ${filename}`);
          }
        });
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading ${url}: ${err}`);
    });
});
