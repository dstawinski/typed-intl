#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";

export const extractTranslations = async () => {
  const { inputDir, outputDir } = getTranslationDirectories();
  const translationDirs = (await fs.readdir(inputDir)).filter(el =>
    fs.lstatSync(path.join(inputDir, el)).isDirectory()
  );
  await processTranslationDirs(translationDirs, inputDir, outputDir);
};

extractTranslations();

function getTranslationDirectories() {
  const userArguments = process.argv.slice(2);
  const inputDir = userArguments[0];
  const outputDir = userArguments[1];
  return { inputDir, outputDir };
}

async function processTranslationDirs(
  translationDirs: string[],
  inputDir: string,
  outputDir: string
) {
  for (const translationDir of translationDirs) {
    const tDirInputPath = path.join(inputDir, translationDir);
    const tDirOutputPath = path.join(outputDir, translationDir);
    const tDirInputFilenames = await fs.readdir(tDirInputPath);
    for (const inputFilename of tDirInputFilenames) {
      if (fs.lstatSync(path.join(tDirInputPath, inputFilename)).isFile()) {
        await convertToJSON(tDirInputPath, inputFilename, tDirOutputPath);
      }
    }
  }
}
async function convertToJSON(
  tDirInputPath: string,
  inputFilename: string,
  tDirOutputPath: string
) {
  const translationObject = await extractObjectDefinition(
    tDirInputPath,
    inputFilename
  );
  if (translationObject) {
    createJSONFile(translationObject, tDirOutputPath, inputFilename);
  }
}
function createJSONFile(
  translationObject: string,
  tDirOutputPath: string,
  inputFilename: string
) {
  const translationJSON = fixKeys(translationObject);
  const translatonJSONWithoutSingle = removeSingleQuotes(translationJSON);
  fs.outputFile(
    path.join(tDirOutputPath, inputFilename.replace(/\.ts$/, ".json")),
    translatonJSONWithoutSingle
  );
}

function fixKeys(translationObject: string) {
  const objectKeysRegex = /(^\s+)(\w+)(:)/gm;
  const translationJSON = translationObject.replace(
    objectKeysRegex,
    '$1"$2"$3'
  );
  return translationJSON;
}

function removeSingleQuotes(translationObject: string) {
  const singleQuotesRegex = /'([^']*)',/g;
  const translationJSON = translationObject.replace(singleQuotesRegex, '"$1"');
  return translationJSON;
}

async function extractObjectDefinition(
  tDirInputPath: string,
  inputFilename: string
) {
  const objectRegex = /{(((.|\s)(?!}))*):((.|\s)*)}/gm;
  const file = await fs.readFile(path.join(tDirInputPath, inputFilename));
  const fileString = file.toString();
  const regexResult = objectRegex.exec(fileString);
  const translationObject = regexResult && regexResult[0];
  return translationObject;
}
