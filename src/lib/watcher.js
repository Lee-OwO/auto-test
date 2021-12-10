const path = require("path");
const chokidar = require("chokidar");

const log = console.log.bind(console);

module.exports = function ({ sourceDirPath, add, change, remove }) {
  const watchPath = path.resolve(__dirname, sourceDirPath);
  const watcher = chokidar.watch(watchPath, {
    persistent: true,
  });
  watcher
    .on("add", (path) => {
      log(`add:  File ${path} has been added`);
      add && add(path);
    })
    .on("change", (path) => {
      log(`change: File ${path} has been changed`);
      change && change(path);
    })
    .on("unlink", (path) => {
      log(`remove: File ${path} has been removed`);
      remove && remove(path);
    })
    .on("addDir", (path) => log(`addDir: Directory ${path} has been added`))
    .on("unlinkDir", (path) =>
      log(`removeDir: Directory ${path} has been removed`)
    )
    .on("ready", () => log("ready: Initial scan complete. Ready for changes"));
};
