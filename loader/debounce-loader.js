const {validate} = require('schema-utils');

const schema = {
    type: 'object',
    properties: {
        themePath: {type: 'string'}
    },
    required: ['themePath']
};

module.exports = function (content) {
    // 1. 獲取與校驗：展現工程嚴謹性
    const options = this.getOptions();
    validate(schema, options, {name: 'ThemeLoader'});

    const {themePath} = options;

    // 2. 核心 API：將主題文件加入 Webpack 依賴圖，保證 HMR 熱更新失效問題
    this.addDependency(themePath);

    // 3. 核心邏輯：統一語法織入，兼容 Less/Sass/CSS
    // 統一使用雙引號，避免路徑中包含特殊字符導致的解析錯誤
    const injectContent = `@import "${themePath}";\n`;

    // 4. 返回：純字符串拼接建議同步返回，優化 Loader 執行效率
    return injectContent + content;
};
