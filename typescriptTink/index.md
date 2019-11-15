1. package.json安装依赖
```javascript
    var dev = {
        "ts-loader": "^6.2.1",
        "tslint": "^5.8.0",
        "tslint-config-standard": "^7.0.0",
        "tslint-loader": "^3.5.3",
        "typescript": "^2.9.2",
        "typescript-eslint-parser": "^14.0.0",
    }
```

2. 项目目录建立tsconfig.json
```javascript
{
  "compileOnSave": true,
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ],
  "compilerOptions": {
    "noUnusedLocals": true, //若有未使用的局部变量则抛错
    "noUnusedParameters": true,//若有未使用的参数则抛错。
    "baseUrl": ".", //解析非相对模块名的基准目
    "paths": {
      "@/*": ["*", "src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "allowJs": true,  //允许编译javascript文件
    "module": "esnext", //指定生成哪个模块系统代码
    "target": "es5",  //指定ECMAScript目标版本
    "moduleResolution": "node", //决定如何处理模块。或者是"Node"对于Node.js/io.js，或者是"Classic"（默认）
    "isolatedModules": false,   //将每个文件作为单独的模块
    "lib": [  //编译过程中需要引入的库文件的列表。
      "es5", "es6", "dom"
    ],
    "sourceMap": true,
    "pretty": true,  //给错误和消息设置样式，使用颜色和上下文。
    "noEmit": false
  }
}

```

3. 项目目录建立tslint.json
```javascript
{
    "defaultSeverity": "error",
    "extends": "tslint-config-standard",
    "globals": {
        "require": true
    },
    "rules": {
        "await-promise": false,
        "no-unused-variable": false,
        "no-unnecessary-type-assertion": false,
        "strict-type-predicates": false,
        "no-unnecessary-qualifier":false,
        "no-floating-promises":false,
        "no-use-before-declare": false,
         "triple-equals": false,
        "indent": [false],
        "no-consecutive-blank-lines": false,
        "semicolon": [false],
        "space-before-function-paren": false,
        "whitespace": false,
        "no-trailing-whitespace": false,
        "prefer-const": false,
        "one-line": false,
        "quotemark": false,
        "no-empty": false,
        "no-var-keyword": false,
        "trailing-comma": [false],
        "no-conditional-assignment": false
    }
}
```

4. 配置文件添加ts-loader
```javascript
    rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
            "babel-loader",
            {
                loader: "ts-loader",
                options: { appendTsxSuffixTo: [/\.vue$/] }
            },
            {
                loader: 'tslint-loader'
            }
        ]
    }]

```

5. src目录添加全局定义文件
vue-shim.d.ts
```javascript
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue
}
```

js-shim.d.ts
```javascript
declare module '*.js'
```

global.d.ts
```javascript
// 定义一个全局变量 window 类型为Window
declare var window: Window;
// 截取Window接口
interface Window {
    setCookie: Function;
    getCookie: Function;
}
```

6. 项目配置的入口文件由.js改为.ts文件

7. 编写vue文件
```html
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import yourComponent from "./yourComponent.vue";

@Component({
  components: { yourComponent },
  filters: {
    nextLevel(num) {
      return parseInt(num, 10) + 1;
    }
  }
})
export default class App extends Vue {
  private v1: string = "user";
  public v2: object = {};
  protected v3: object = {};

  @Prop()
  public someInfo: any;

  //计算属性
  get v1Computed(){
      return this.v1 + '1';
  }

  changeTab(tab) {
    this.v1 = tab;
  }

  mounted() {
  }
}
</script>
```