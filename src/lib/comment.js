class Info {
  paramsInfo = [];
  returnInfo = {};
  example = [];
  des = "";
  constructor() {}

  getParamData(text) {
    const list = text.split(" ").filter((v) => !!v);
    const result = {
      type: text.match(/{(.*)}/)[1],
      key: list[2],
      des: list[3],
    };
    this.paramsInfo.push(result);
  }
  getDesData(text) {
    this.des += text;
  }
  getReturnData(text) {
    const list = text.split(" ").filter((v) => !!v);
    const result = {
      type: text.match(/{(.*)}/)[1],
      des: list[2],
    };
    this.returnInfo = result;
  }
  getExampleData(text) {
    const reg = /[^()]+(?=\))/g;
    const valueList = text.match(reg) || [];
    const type = text
      .replace(reg, "")
      .split(" ")
      .filter((v) => !!v)[2];
    this.example.push({
      input: valueList[0] || "",
      type,
      result: valueList[1] || "",
    });
  }

  updata(text) {
    const actions = [
      [/@param/, this.getParamData],
      [/@return/, this.getReturnData],
      [/@example/, this.getExampleData],
      [/.*/, this.getDesData],
    ];
    const fn = actions.find(([reg]) => reg.test(text))[1];
    if (!fn) return;
    fn.call(this, text);
  }
}

function parse(data) {
  const result = new Info();
  data
    .split("*")
    .map((v) => v.replace("\n", "").trim())
    .filter((v) => !!v)
    .forEach((v) => result.updata(v));
  return result;
}

module.exports = {
  parse,
};
