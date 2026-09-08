const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
for (const directory of ["public", "views"]) {
  const source = path.join(root, "src", directory);
  const destination = path.join(root, "dist", directory);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
}
