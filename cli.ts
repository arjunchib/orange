#!/usr/bin/env bun

import { command_map, commands } from "./src/cli/commands";

const cmd_name = Bun.argv[2].trim();
await command_map.get(cmd_name)?.main({ commands, working_dir: __dirname });
