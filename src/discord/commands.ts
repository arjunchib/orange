import { slashCommand, string, subcommand } from "peach";
import { readdirSync } from "fs";

const projects = readdirSync("../").filter((dir) => !dir.startsWith("."));

export const setEnv = subcommand("set", "set environment variable").options([
  string("project", "name of project").required().choices(projects),
  string("name", "name of variable").required().autocomplete(),
  string("value", "value to set").required(),
]);

export const deleteEnv = subcommand(
  "delete",
  "remove environment variable"
).options([
  string("project", "name of project").required().choices(projects),
  string("name", "name of variable").required().autocomplete(),
]);

export const getEnv = subcommand(
  "get",
  "read all environment variables"
).options([string("project", "name of project").required().choices(projects)]);

export const env = slashCommand("env", "update environment variables").options([
  setEnv,
  deleteEnv,
  getEnv,
]);

export const add_project = subcommand("add", "add a project").options([
  string("name", "name of repo").required().autocomplete(),
]);

export const project = slashCommand("project", "modify projects").options([
  add_project,
]);

export const commands = { env, project };
