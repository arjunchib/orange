import { Route, commandRoute } from "peach";
import { deleteEnv, getEnv, setEnv } from "./commands";
import { EnvController } from "./controllers/env_controller";

export const routes: Route[] = [
  commandRoute(setEnv).to(EnvController, "set"),
  commandRoute(deleteEnv).to(EnvController, "delete"),
  commandRoute(getEnv).to(EnvController, "get"),
];
