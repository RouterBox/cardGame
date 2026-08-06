name: cardgame-design-shelf-server
title: Design Shelf LAN Server
project: cardgame
risk_class: standard
mode: autopilot
test_cmd: node --test

## Intent

Add a zero-dependency static file server that serves the design-shelf site (already produced by tools/build-site.js into site/) bound to 0.0.0.0 by default, exposed via an npm script, so the existing design content is reachable from a phone on the local network without any file/folder spelunking on the desktop.

## Acceptance Criteria

- AC1 [paraphrase]: tools/serve-site.js exists and starts a Node http server that serves files from the site/ directory
- AC2 [inferred]: An npm script named site:serve runs tools/serve-site.js
- AC3 [paraphrase]: The server binds host 0.0.0.0 by default (overridable) so it is reachable from other devices on the same LAN, not just localhost
- AC4 [inferred]: GET / returns HTTP 200 and the design-shelf index.html body
- AC5 [inferred] (held_out): Requests for a nonexistent path return HTTP 404 instead of crashing the server process
- AC6 [inferred] (held_out): Served .html and .svg files include correct Content-Type response headers
