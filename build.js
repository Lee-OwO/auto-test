const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const sourcePath = path.resolve(__dirname, "./src");
const targetPath = path.resolve(__dirname);

const mapDir = (d, t) => {
  try {
    fs.mkdirSync(t);
  } catch (error) {
    console.log("mkdir err", t);
  }
  const [dirs, files] = _(fs.readdirSync(d)).partition((p) =>
    fs.statSync(path.join(d, p)).isDirectory()
  );

  dirs.forEach((dir) => {
    mapDir(path.join(d, dir), path.join(t, dir));
  });

  files.forEach((file) => {
    if (path.extname(file) === ".js") {
      spawn(`uglifyjs ${path.join(d, file)} -c -m -o ${path.join(t, file)}`, {
        stdio: "inherit",
        shell: true,
      });
    }
  });
};
try {
  if (targetPath !== __dirname) {
    fs.rmSync(targetPath, { recursive: true });
  } else {
    fs.rmSync(path.join(targetPath, "lib"), { recursive: true });
    fs.rmSync(path.join(targetPath, "bin"), { recursive: true });
  }
} catch (error) {
  console.log("rm error", error);
}
mapDir(sourcePath, targetPath);
