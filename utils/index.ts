import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";
import * as yaml from "yaml";

/**
 * Returns an Object containing all the setting depending on mode
 * @param mode, either 'dev' or 'prod'
 * @param envDirPath, default is "env" dir
 * @returns Object
 */
export const loadEnvironmentVariablesFile = (
  mode: "dev" | "prod",
  envDirPath = path.join(process.cwd(), "env")
) => {
  // Base is the common part
  const baseYaml = fs.readFileSync(path.join(envDirPath, ".base.yaml"), "utf-8");
  const modeYaml = fs.readFileSync(
    path.join(envDirPath, mode === "prod" ? ".prod.yaml" : ".dev.yaml"),
    "utf-8"
  );
  
  // Build a global object containing all env variable in on single Object
  const baseObj = yaml.parse(baseYaml);
  const modeObj = yaml.parse(modeYaml);
  return Object.assign({}, baseObj, modeObj);
};
  

export const setDotEnvironmentFile = (
  mode: "dev" | "prod",
  envDirPath: string = path.join(process.cwd(), "env")
) => {
  dotenv.config({ path: envDirPath+`/.${mode}.env` });
}