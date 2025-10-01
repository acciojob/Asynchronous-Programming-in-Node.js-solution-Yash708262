const fs = require("fs");
const http = require("http");
const https = require("https");

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: node app.js <API_URL> <OUTPUT_FILE>");
  process.exit(1);
}

const apiUrl = args[0];
const filePath = args[1];

// Select protocol (http or https)
const protocol = apiUrl.startsWith("https") ? https : http;

// Send GET request
protocol.get(apiUrl, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const jsonData = JSON.parse(data);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("❌ Error writing file:", err);
          process.exit(1);
        }
        console.log("✅ Data saved to", filePath);
        console.log(jsonData); // print JSON for test case verification
      });
    } catch (err) {
      console.error("❌ Error parsing JSON:", err);
    }
  });
}).on("error", (err) => {
  console.error("❌ Error fetching data:", err);
});
