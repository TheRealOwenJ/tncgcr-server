export { handler };

let history = {};
let settingz = {
  saverate: 10,
  messagecount: 0,
};

let msgCount = 0;

async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).send("Method Not Allowed");
  }

  if (req.method === "GET" && req.url.split("?")[0] === "/api/get") {
    return res.status(200).json(history);
  }

  let body;
  try {
    body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
  } catch {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  if (body === undefined || body === null) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  const id = ++msgCount;
  history[id] = body;
  settingz["messagecount"] = msgCount;
  console.log(history);
  return res.status(200).json({
    received: body,
    id,
  });
}
