<template>
  <div class="block_content array">
    <ol class="array-ol">
      <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
        <li
          v-for="(member, index) in flowData"
          :key="`${member.type}${index}`"
          :class="['array-item', {'hide-item': hideMyItem[index] == true}]"
        >
          <p v-if="member.type !== 'object' && member.type !== 'array'">
            <el-input
              type="textarea"
              autosize
              v-model="member.remark"
              :title="member.remark"
              class="val-input"
              v-if="member.type === 'string'"
              @focus="valFocus(member, $event)"
              placeholder="string"
            />
            <el-input
              type="number"
              v-model.number="member.remark"
              class="val-input"
              :title="member.remark"
              v-if="member.type == 'number'"
              placeholder="number"
              @focus="valFocus(member, $event)"
              @input="numberInputChange(member)"
            />
            <select
              name="value"
              v-model="member.remark"
              class="val-input"
              v-if="member.type == 'boolean'"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </p>
          <div v-else>
            <span :class="['json-key', 'json-desc']">
              {{member.type.toUpperCase()}}
              <i
                class="collapse-down v-json-edit-icon-arrow_drop_down"
                v-if="member.type == 'object' || member.type == 'array'"
                @click="closeBlock(index, $event)"
              ></i>
              <i v-if="member.type == 'object'">{{'{' + member.childParams.length + '}'}}</i>
              <i v-if="member.type == 'array'">{{'[' + member.childParams.length + ']'}}</i>
            </span>

            <span class="json-val">
              <template v-if="member.type == 'array'">
                <array-view @valEvent="valArrEvent" :parsedData="member.childParams || []" v-model="member.childParams"></array-view>
              </template>

              <template v-if="member.type == 'object'">
                <json-view @keyEvent="keyArrEvent"
                           @valEvent="valArrEvent" :parsedData="member.childParams || {}" v-model="member.childParams"></json-view>
              </template>
            </span>
          </div>

          <div class="tools">
            <select v-model="member.type" class="tools-types" @change="itemTypeChange(member)">
              <option v-for="(item, index) in formats" :value="item" :key="index">{{item}}</option>
            </select>
            <i class="dragbar v-json-edit-icon-drag"></i>
            <i class="del-btn" @click="delItem(parsedData, member, index)">
              <i class="v-json-edit-icon-huishouzhan_huaban"></i>
            </i>
          </div>
        </li>
      </draggable>
    </ol>

    <item-add-form v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem" :needName="false"></item-add-form>

    <div class="block add-key" v-if="!toAddItem" @click="addItem">
      <i class="v-json-edit-icon-add"></i>
    </div>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";
import {Message, MessageBox} from "element-ui"
export default {
  name: "ArrayView",
  props: ["parsedData"],
  data: function() {
    return {
      formats: ["string", "array", "object", "number", "boolean"],
      flowData: this.parsedData,
      toAddItem: false,
      hideMyItem: {}
    };
  },
  watch: {
    parsedData: {
      handler(newValue, oldValue) {
        this.flowData = this.parsedData || [];
      }
    }
  },
  components: {
    "item-add-form": ItemAddForm,
    "json-view": () => import("./JsonView.vue")
  },
  methods: {
    keyArrEvent(value){
      this.$emit("keyArrayFocus",value);
    },
    valArrEvent(value){
      this.$emit("valArrayFocus",value);
    },
    keyFocus(item, e){
      this.$emit("keyArrayFocus",item.remark);
    },
    valFocus(item){
      this.$emit("valArrayFocus",item.remark);
    },
    delItem: function(parentDom, item, index) {
      let vm = this
      MessageBox.confirm("确定删除该条数据吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.flowData.splice(index, 1);
        if (vm.hideMyItem[index]) vm.hideMyItem[index] = false;
        vm.$emit("input", this.flowData);
      }).catch(function () {

      })
    },

    addItem: function() {
      this.toAddItem = true;
    },

    cancelNewItem: function() {
      this.toAddItem = false;
    },

    closeBlock: function(index, e) {
      this.$set(this.hideMyItem, index, this.hideMyItem[index] ? false : true);
    },

    newItem: function(obj) {
      this.toAddItem = false;

      let oj = {
        name: obj.key,
        type: obj.type
      };
      if (obj.type == "array" || obj.type == "object") {
        oj.childParams = obj.val;
        oj.remark = null;
      } else {
        oj.childParams = null;
        oj.remark = obj.val;
      }

      this.flowData.push(oj);
      this.$emit("input", this.flowData);
      this.cancelNewItem();
    },

    onDragEnd: function() {
      this.$emit("input", this.flowData);
    },

    itemTypeChange: function(item) {
      if (item.type === "array" || item.type === "object") {
        item.childParams = [];
        item.remark = null;
      }
      if (item.type === "boolean") {
        item.remark = true;
      }
      if (item.type === "string") {
        item.remark = "";
      }
      if (item.type === "number") {
        item.remark = 0;
      }
    },

    numberInputChange: function(item) {
      if (!item.remark) item.remark = 0;
    }
  }
};
</script>
<style lang="less" scoped>
  @import "./assets/styles/common.less";
  @import '../node_modules/element-ui/lib/theme-chalk/index.css';
</style>
