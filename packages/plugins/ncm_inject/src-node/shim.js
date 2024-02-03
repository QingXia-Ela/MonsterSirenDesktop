/**
 * 这是一个胶水文件，用来替换全局的 require，将模块从 node 原生的 替换为 deno 实现的方法
 */

const DenoTest = require("@deno/shim-deno")

/**
 * @typedef {import("@deno/shim-deno").Deno} Deno
 */

/**
 * @type {Deno}
 */
const DenoCore = Deno

const decoder = new TextDecoder("utf-8");

class OsLib {
  static tmpdir() {
    throw new Error("Not implemented");
  }
}

class FsPromiseLib {
  static async readFile(filePath) {
    const data = await DenoCore.readFile(filePath);
    return decoder.decode(data);
  }
}

class FsLib {
  static readFileSync(filePath) {
    const data = DenoCore.readFileSync(filePath);
    return decoder.decode(data);
  }
}

global.require = (moduleId) => {
  switch (moduleId) {
    case "fs":
      return FsLib;
  }
  throw new Error(`Module "${module}" cannot be required in a Deno environment.`);
};