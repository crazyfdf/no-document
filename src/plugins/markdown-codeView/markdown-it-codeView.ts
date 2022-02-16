const path = require("path");
const fs = require("fs");

module.exports = function codeView(md, options) {
  const { componentsPath } = options;

  md.use(require("markdown-it-container"), "demo", {
    validate: function(params) {
      return params.trim().match(/^demo\s+(.*)$/);
    },
    render: function(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const demoInfo = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
        const demoPath = path.join(componentsPath, demoInfo[1]);
        const code = fs.readFileSync(demoPath, "utf-8");
        if (!code) return "";
        // opening tag
        return `<y-code-view code="${encodeURIComponent(code)}" path="${
          demoInfo[1]
        }">`;
      } else {
        // closing tag
        return `</y-code-view>`;
      }
    }
  });
};
