setInterval(() => {
  fs.writeFileSync("./document.txt", documentContent);
}, 10000); // 10 seconds

app.post("/sincro_doc", (req, res) => {});
