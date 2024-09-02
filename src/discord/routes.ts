import { Route, autocompleteRoute, commandRoute } from "peach";
import { deleteEnv, getEnv, setEnv } from "./commands";
import { EnvController } from "./controllers/env_controller";

export const routes: Route[] = [
  commandRoute(setEnv).to(EnvController, "set"),
  commandRoute(deleteEnv).to(EnvController, "delete"),
  commandRoute(getEnv).to(EnvController, "get"),

  autocompleteRoute(setEnv).focus("name").to(EnvController, "autocompleteName"),
  autocompleteRoute(deleteEnv)
    .focus("name")
    .to(EnvController, "autocompleteName"),
];
