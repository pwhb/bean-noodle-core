const fs = require("fs");
const path = require("path");

const parseTemplate = (template, content) => {
  const keys = Object.keys(content);
  for (keyName of keys) {
    const regex = new RegExp("{{" + keyName + "}}", "g");
    template = template.replace(regex, content[keyName]);
  }
  return template;
};

const getHtml = (fileName, content) => {
  const filePath = path.join(__dirname, `templates/${fileName}`);
  const template = fs.readFileSync(filePath, "utf8");
  const html = parseTemplate(template, content);
  return html;
};

module.exports = {
  parseTemplate,
  getHtml,
};
