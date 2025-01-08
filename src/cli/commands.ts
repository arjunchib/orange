import { HelpCommand } from "./commands/help_command";
import { SetupCommand } from "./commands/setup_command";
import { TeardownCommand } from "./commands/teardown_command";

export const commands = [
  new SetupCommand(),
  new TeardownCommand(),
  new HelpCommand(),
];

export const command_map = new Map(commands.map((cmd) => [cmd.name, cmd]));
