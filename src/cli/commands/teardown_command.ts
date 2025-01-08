import { $ } from "bun";

export class TeardownCommand {
  name = "teardown";
  description = "undos everything from setup";

  async main() {
    await $`sudo systemctl disable orange`;
    await $`sudo systemctl stop orange`;
    await $`sudo rm /etc/systemd/system/orange.service`;
  }
}
