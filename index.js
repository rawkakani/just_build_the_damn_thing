const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // /play endpoint for GET and POST
  if (url.pathname === "/play") {
    if (req.method === "POST") {
      // Increment the counter atomically
      const res = await kv.atomic().sum(["plays"], 1n).commit();
      const count = res.value ?? 1n;
      return new Response(JSON.stringify({ count: Number(count) }), {
        headers: { "content-type": "application/json" },
      });
    }
    if (req.method === "GET") {
      const res = await kv.get(["plays"]);
      const count = res.value ?? 0n;
      return new Response(JSON.stringify({ count: Number(count) }), {
        headers: { "content-type": "application/json" },
      });
    }
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Serve index.html for all other routes
  const file = await Deno.readFile("./index.html");
  return new Response(file, {
    headers: { "content-type": "text/html" },
  });
}, { port: 8000 });

console.log("Listening on http://localhost:8000");