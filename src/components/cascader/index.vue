<template>
  <div class="cascader">
    <div class="label" @click="showSelect">
      <input type="text" placeholder="请选择" :value="label" readonly />
    </div>
    <div class="content" v-show="isShow">
      <ul v-for="(item, index) in tempData" :key="index">
        <li
          @click="clickCurrentElement(child, index + 1)"
          v-for="child in item.list"
          :key="child.value"
          :class="value.includes(child.value) ? 'active' : ''"
        >
          {{ child.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "cascader",
  props: {
    options: {
      type: Array,
      required: false,
      default: () => {
        return [
          {
            value: "zhinan",
            label: "指南",
            children: [
              {
                value: "shejiyuanze",
                label: "设计原则",
                children: [
                  {
                    value: "yizhi",
                    label: "一致"
                  },
                  {
                    value: "fankui",
                    label: "反馈"
                  },
                  {
                    value: "xiaolv",
                    label: "效率"
                  },
                  {
                    value: "kekong",
                    label: "可控"
                  }
                ]
              },
              {
                value: "daohang",
                label: "导航",
                children: [
                  {
                    value: "cexiangdaohang",
                    label: "侧向导航"
                  },
                  {
                    value: "dingbudaohang",
                    label: "顶部导航"
                  }
                ]
              }
            ]
          },
          {
            value: "zujian",
            label: "组件",
            children: [
              {
                value: "basic",
                label: "Basic",
                children: [
                  {
                    value: "layout",
                    label: "Layout 布局"
                  },
                  {
                    value: "color",
                    label: "Color 色彩"
                  },
                  {
                    value: "typography",
                    label: "Typography 字体"
                  },
                  {
                    value: "icon",
                    label: "Icon 图标"
                  },
                  {
                    value: "button",
                    label: "Button 按钮"
                  }
                ]
              },
              {
                value: "form",
                label: "Form",
                children: [
                  {
                    value: "radio",
                    label: "Radio 单选框"
                  },
                  {
                    value: "checkbox",
                    label: "Checkbox 多选框"
                  },
                  {
                    value: "input",
                    label: "Input 输入框"
                  },
                  {
                    value: "input-number",
                    label: "InputNumber 计数器"
                  },
                  {
                    value: "select",
                    label: "Select 选择器"
                  },
                  {
                    value: "cascader",
                    label: "Cascader 级联选择器"
                  },
                  {
                    value: "switch",
                    label: "Switch 开关"
                  },
                  {
                    value: "slider",
                    label: "Slider 滑块"
                  },
                  {
                    value: "time-picker",
                    label: "TimePicker 时间选择器"
                  },
                  {
                    value: "date-picker",
                    label: "DatePicker 日期选择器"
                  },
                  {
                    value: "datetime-picker",
                    label: "DateTimePicker 日期时间选择器"
                  },
                  {
                    value: "upload",
                    label: "Upload 上传"
                  },
                  {
                    value: "rate",
                    label: "Rate 评分"
                  },
                  {
                    value: "form",
                    label: "Form 表单"
                  }
                ]
              },
              {
                value: "data",
                label: "Data",
                children: [
                  {
                    value: "table",
                    label: "Table 表格"
                  },
                  {
                    value: "tag",
                    label: "Tag 标签"
                  },
                  {
                    value: "progress",
                    label: "Progress 进度条"
                  },
                  {
                    value: "tree",
                    label: "Tree 树形控件"
                  },
                  {
                    value: "pagination",
                    label: "Pagination 分页"
                  },
                  {
                    value: "badge",
                    label: "Badge 标记"
                  }
                ]
              },
              {
                value: "notice",
                label: "Notice",
                children: [
                  {
                    value: "alert",
                    label: "Alert 警告"
                  },
                  {
                    value: "loading",
                    label: "Loading 加载"
                  },
                  {
                    value: "message",
                    label: "Message 消息提示"
                  },
                  {
                    value: "message-box",
                    label: "MessageBox 弹框"
                  },
                  {
                    value: "notification",
                    label: "Notification 通知"
                  }
                ]
              },
              {
                value: "navigation",
                label: "Navigation",
                children: [
                  {
                    value: "menu",
                    label: "NavMenu 导航菜单"
                  },
                  {
                    value: "tabs",
                    label: "Tabs 标签页"
                  },
                  {
                    value: "breadcrumb",
                    label: "Breadcrumb 面包屑"
                  },
                  {
                    value: "dropdown",
                    label: "Dropdown 下拉菜单"
                  },
                  {
                    value: "steps",
                    label: "Steps 步骤条"
                  }
                ]
              },
              {
                value: "others",
                label: "Others",
                children: [
                  {
                    value: "dialog",
                    label: "Dialog 对话框"
                  },
                  {
                    value: "tooltip",
                    label: "Tooltip 文字提示"
                  },
                  {
                    value: "popover",
                    label: "Popover 弹出框"
                  },
                  {
                    value: "card",
                    label: "Card 卡片"
                  },
                  {
                    value: "carousel",
                    label: "Carousel 走马灯"
                  },
                  {
                    value: "collapse",
                    label: "Collapse 折叠面板"
                  }
                ]
              }
            ]
          },
          {
            value: "ziyuan",
            label: "资源",
            children: [
              {
                value: "axure",
                label: "Axure Components"
              },
              {
                value: "sketch",
                label: "Sketch Templates"
              },
              {
                value: "jiaohu",
                label: "组件交互文档"
              }
            ]
          }
        ];
      }
    }
  },
  data() {
    return {
      tempData: [],
      value: ["zhinan", "shejiyuanze"],
      label: "",
      isShow: false,
      focusFlag: false
    };
  },
  created() {
    this.findElementByIds();
  },
  methods: {
    initTempdata() {
      const tempData = this.options.map(item => {
        return {
          value: item.value,
          label: item.label
        };
      });
      this.tempData.push({
        list: tempData
      });
    },
    findElementByIds() {
      const tempData = [];
      this.value.forEach(item => {
        tempData.push({
          list: this.findElement(this.options, item)
        });
      });
      if (tempData.length) {
        this.label = this.findLabel(
          this.options,
          this.value[this.value.length - 1]
        );
        this.initTempdata();
        tempData.pop();
        this.tempData.push(...tempData);
      }
    },
    findLabel(data, value) {
      const length = data.length;
      for (let i = 0; i < length; i++) {
        const item = data[i];
        if (item.value === value) {
          return item.label;
        }
        if (item.children && item.children.length) {
          const result = this.findLabel(item.children, value);
          if (result) {
            return result;
          }
        }
      }
    },
    findElement(data, value) {
      const length = data.length;
      for (let i = 0; i < length; i++) {
        const item = data[i];
        if (item.value === value) {
          return item.children;
        }
        if (item.children && item.children.length) {
          const result = this.findElement(item.children, value);
          if (result) {
            return result;
          }
        }
      }
    },
    showSelect() {
      this.isShow = true;
    },
    setValue(index, value) {
      this.$set(this.value, index, value);
    },
    clickCurrentElement({ value, label }, index) {
      const result = this.findElement(this.options, value);
      this.value.length = index - 1;
      this.setValue(index - 1, value);
      this.tempData.length = index;
      if (result) {
        this.tempData.push({
          list: result
        });
      } else {
        this.$emit("change", this.label);
        this.isShow = false;
        this.label = label;
      }
      this.focusFlag = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.cascader {
  font-size: 14px;
  .label {
    cursor: pointer;
    width: 180px;
  }
  input[type="text"]:focus {
    outline: 1px solid #66b1ff;
    border: 1px solid #fff;
    border-radius: 4px;
  }

  .focus {
    outline: 1px solid #66b1ff;
    border: 1px solid #66b1ff;
    border-radius: 4px;
  }
  input[type="text"] {
    border-radius: 4px;
    outline: 1px solid #fff;
    border: 1px solid gray;
    height: 16px;
    padding: 5px;
  }
  .content {
    display: flex;
    ul {
      min-height: 130px;
      min-width: 140px;
      padding: 5px 0;
      border: 1px solid #e4e7ed;
      margin-right: 1px;
    }
    .active {
      color: #409eff;
      font-weight: 700;
    }
    li {
      list-style-type: none;
      cursor: pointer;
      padding: 0 10px;
      height: 25px;
      text-align: center;
      line-height: 25px;
    }
  }
}
</style>
