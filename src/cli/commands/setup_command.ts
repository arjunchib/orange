import { $ } from "bun";

export class SetupCommand {
  name = "setup";
  description = "starts service to run orange";

  async main(context: { working_dir: string }) {
    const user = process.env.USER;

    const service = `[Unit]
Description=Orange
After=network.target

[Service]
Type=simple
User=${user}
WorkingDirectory=${context.working_dir}
ExecStart=/home/${user}/.bun/bin/bun run serve
Restart=always

[Install]
WantedBy=multi-user.target
`;

    await $`echo "${service}" | sudo tee /etc/systemd/system/orange.service`;
    await $`sudo setcap CAP_NET_BIND_SERVICE=+eip ~/.bun/bin/bun`;
    await $`sudo systemctl enable orange`;
    await $`sudo systemctl start orange`;
  }
}
