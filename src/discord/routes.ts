import { Route, autocompleteRoute, commandRoute } from "peach";
import { add_project, list_project, delete_project } from "./commands";
import { ProjectController } from "./controllers/project_controller";

export const routes: Route[] = [
  commandRoute(add_project).to(ProjectController, "add"),
  commandRoute(list_project).to(ProjectController, "list"),
  commandRoute(delete_project).to(ProjectController, "delete"),
  autocompleteRoute(add_project)
    .focus("name")
    .to(ProjectController, "autocompleteRepo"),
  autocompleteRoute(delete_project)
    .focus("name")
    .to(ProjectController, "autocompleteName"),
];
