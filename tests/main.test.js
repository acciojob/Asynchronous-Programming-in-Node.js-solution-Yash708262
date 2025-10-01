const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

describe("Download URLs to Files", () => {
  const urls = ["https://www.facebook.com/", "https://www.google.com/"];
  const appPath = path.join(__dirname, '..', 'main.js');

  test("Download content of URLs", () => {
    execSync(`node ${appPath} ${urls.join(" ")}`);

    const files = fs.readdirSync(".");
    const actualHtmlFileCount = files.filter((file) => file.endsWith(".html"));

    expect(actualHtmlFileCount.length).toEqual(urls.length);
    actualHtmlFileCount.forEach((file) => {
      const hostname = file.split(".")[0];
      const content = fs.readFileSync(file, "utf8");
      expect(content).toContain(hostname);
    });
  });

  test("Error on empty URL list", () => {
    try {
      execSync(`node ${appPath}`);
    } catch (error) {
      expect(error.stderr.toString().trim()).toBe("Error: URLs array is empty. Please provide URLs to download.");
    }
  });
});
