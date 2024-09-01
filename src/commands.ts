import { slashCommand, string, subcommand } from "peach";
import { readdirSync } from "fs";

const projects = readdirSync("../").filter((dir) => !dir.startsWith("."));

export const setEnv = subcommand("set", "set environment variable").options([
  string("project", "name of project").required().choices(projects),
  string("name", "name of variable").required(),
  string("value", "value to set").required(),
]);

export const deleteEnv = subcommand(
  "delete",
  "remove environment variable"
).options([
  string("project", "name of project").required().choices(projects),
  string("name", "name of variable").required(),
]);

export const env = slashCommand("env", "update environment variables").options([
  setEnv,
  deleteEnv,
]);

export const commands = { env };
