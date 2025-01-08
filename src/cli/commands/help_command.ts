import { styleText } from "node:util";

export class HelpCommand {
  name = "help";
  description = "shows this message";

  main(context: { commands: { name: string; description: string }[] }) {
    const output = context.commands
      .map((cmd) => {
        const name = styleText("cyanBright", cmd.name);
        const desc = styleText("dim", cmd.description);
        return `${name} ${desc}`;
      })
      .join("\n");
    console.log(output);
  }
}
