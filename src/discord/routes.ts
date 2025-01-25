import { Route, autocompleteRoute, commandRoute } from "peach";
import {
  add_project,
  deleteEnv,
  getEnv,
  list_project,
  setEnv,
} from "./commands";
import { EnvController } from "./controllers/env_controller";
import { ProjectController } from "./controllers/project_controller";

export const routes: Route[] = [
  commandRoute(setEnv).to(EnvController, "set"),
  commandRoute(deleteEnv).to(EnvController, "delete"),
  commandRoute(getEnv).to(EnvController, "get"),

  autocompleteRoute(setEnv).focus("name").to(EnvController, "autocompleteName"),
  autocompleteRoute(deleteEnv)
    .focus("name")
    .to(EnvController, "autocompleteName"),

  commandRoute(add_project).to(ProjectController, "add"),
  commandRoute(list_project).to(ProjectController, "list"),
  autocompleteRoute(add_project)
    .focus("name")
    .to(ProjectController, "autocompleteName"),
];
