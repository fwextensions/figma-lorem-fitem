const fs = require("fs");
const path = require("path");
const { hyphenateSync } = require("hyphen/la");


function rel(...pathComponents)
{
	return path.resolve(__dirname, ...pathComponents);
}


function ignoreError(func, code)
{
  // Ignore non-fatal errors.
  try {
    func();
  } catch (e) {
    if (e.code !== code) {
      throw e;
    }
  }
}


const outputPath = rel("../src/text");
const loremIpsum = JSON.parse(fs.readFileSync(rel("json/loremIpsum.json"), "utf8"));
const sentences = loremIpsum.sentences.map(sentence => hyphenateSync(sentence));

ignoreError(() => fs.mkdirSync(outputPath), "EEXIST");
fs.writeFileSync(rel(outputPath, "loremIpsum.ts"), `export default ${JSON.stringify(sentences, null, 2)};\n`);
