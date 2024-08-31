import { slashCommand, string, subcommand } from "peach";

export const setEnv = subcommand("set", "set environment variable").options([
  string("name", "name of variable").required(),
  string("value", "value to set").required(),
]);

export const deleteEnv = subcommand(
  "delete",
  "remove environment variable"
).options([string("name", "name of variable").required()]);

export const env = slashCommand("env", "update environment variables").options([
  setEnv,
  deleteEnv,
]);

export const commands = { env };
