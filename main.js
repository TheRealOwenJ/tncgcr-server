const historyFile = Bun.file("./history.json");
const settingzFile = Bun.file("./settingz.json");
let history = await historyFile.json();
let settingz = await settingzFile.json();
let msgCount = Math.max(...Object.keys(history));
const port = Number(process.env.PORT) || 3000;

function writeSettingz() {
  settingz["messagecount"] = msgCount;
  Bun.write("./settingz.json", JSON.stringify(settingz, null, 2));
}

function writeHistory() {
  Bun.write("./history.json", JSON.stringify(history, null, 2));
}

const server = Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(req) {
    if (req.method !== "POST" && req.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }

    if (new URL(req.url).pathname === "/get") {
      return Response.json(history);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        {
          error: "Invalid JSON",
        },
        {
          status: 400,
        },
      );
    }

    const id = ++msgCount;
    history[id] = body;
    console.log(history);
    return Response.json({
      received: body,
      id,
    });
  },
});

setInterval(() => {
  writeHistory();
  writeSettingz();
}, settingz["saverate"] * 1000);

console.log(`server running at http://localhost:${port}`);
