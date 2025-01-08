import { usePeach } from "./discord/main";
import { useGithub } from "./github/main";

Bun.serve({
  port: 8000,
  async fetch(req) {
    if (req.headers.has("x-github-event")) {
      return await useGithub(req);
    } else {
      return await usePeach(req);
    }
  },
});
