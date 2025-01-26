import { slashCommand, string, subcommand } from "peach";
import { readdirSync } from "fs";

const projects = readdirSync("../").filter((dir) => !dir.startsWith("."));

export const add_project = subcommand("add", "add a project").options([
  string("name", "name of repo").required().autocomplete(),
]);

export const list_project = subcommand("list", "list all projects");

export const delete_project = subcommand("delete", "remove a project").options([
  string("name", "name of project").required().autocomplete(),
]);

export const project = slashCommand("project", "modify projects").options([
  add_project,
  list_project,
  delete_project,
]);

export const commands = { project };
