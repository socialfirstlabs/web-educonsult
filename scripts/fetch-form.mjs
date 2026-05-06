import fs from "node:fs/promises";
import https from "node:https";
https.get("https://ui.shadcn.com/r/styles/default/form.json", res => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", async () => {
    const data = JSON.parse(body);
    let content = data.files[0].content;
    content = content.replace("@/registry/default/ui/label", "@/components/ui/label");
    await fs.writeFile("d:/edu-web/components/ui/form.tsx", content);
  });
});
