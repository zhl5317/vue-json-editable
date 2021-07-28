<template>
    <div class="json-view-main">
        <div class="block_content">
            <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
                <div
                        v-for="(item, index) in flowData"
                        :key="`${item.type}${index}`"
                        :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] == true}]"
                >

          <span class="json-key">
            <el-input
                    type="textarea"
                    autosize
                    v-model="item.name"
                    class="key-input"
                    :title="item.name"
                    v-if="typeof item.name == 'string'"
                    @focus="keyFocus(item, $event)"
                    @blur="keyInputBlur(item, $event)"
            />
            <i
                    class="collapse-down v-json-edit-icon-arrow_drop_down"
                    v-if="item.type == 'object' || item.type == 'array'"
                    @click="closeBlock(index, $event)"
            ></i>
            <i v-if="item.type == 'object'" class="i-type">{{'{' + item.childParams.length + '}'}}</i>
            <i v-if="item.type == 'array'" class="i-type">{{'[' + item.childParams.length + ']'}}</i>
          </span>

                    <span class="json-val">
            <template v-if="item.type == 'object'">
              <json-view @keyEvent="keyEvent"
                         @valEvent="valEvent" :parsedData="item.childParams" v-model="item.childParams"></json-view>
            </template>

            <template v-else-if="item.type == 'array'">
              <array-view :parsedData="item.childParams" @keyArrayFocus="keyArrayFocus"
                          @valArrayFocus="valArrayFocus" v-model="item.childParams"></array-view>
            </template>

            <template v-else>
              <span class="val">
                <el-input
                        type="textarea"
                        autosize
                        v-model="item.remark"
                        :title="item.remark"
                        class="val-input"
                        @focus="valFocus(item, $event)"
                        v-if="item.type == 'string'"
                />
                <el-input
                        type="number"
                        v-model.number="item.remark"
                        class="val-input"
                        :title="item.remark"
                        v-if="item.type == 'number'"
                        @focus="valFocus(item, $event)"
                        @input="numberInputChange(item)"
                />
                <select
                        name="value"
                        v-model="item.remark"
                        class="val-input"
                        v-if="item.type == 'boolean'"
                >
                  <option :value="true">true</option>
                  <option :value="false">false</option>
                </select>
              </span>
            </template>
          </span>

                    <div class="tools">
                        <select v-model="item.type" class="tools-types" @change="itemTypeChange(item)">
                            <option v-for="(type, index) in formats" :value="type" :key="index">{{type}}</option>
                        </select>
                        <i class="dragbar v-json-edit-icon-drag"></i>
                        <i class="del-btn" @click="delItem(parsedData, item, index)">
                            <i class="v-json-edit-icon-huishouzhan_huaban"></i>
                        </i>
                    </div>
                </div>
            </draggable>

            <item-add-form v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem"></item-add-form>

            <div class="block add-key" @click="addItem" v-if="!toAddItem">
                <i class="v-json-edit-icon-add"></i>
            </div>
        </div>
    </div>
</template>

<script>

    import ItemAddForm from "./ItemAddForm.vue";
    import {Message, MessageBox} from "element-ui"

    export default {
        name: "JsonView",
        props: {parsedData: {}},
        data() {
            return {
                formats: ["string", "array", "object", "number", "boolean"],
                flowData: this.parsedData,
                toAddItem: false,
                hideMyBlock: {},
            };
        },
        created() {
            this.flowData = this.parsedData || {};
        },
        watch: {
            parsedData: {
                handler(newValue, oldValue) {
                    this.flowData = this.parsedData;
                }
            }
        },
        components: {
            "item-add-form": ItemAddForm,
            "array-view": () => import("./ArrayView.vue")
        },
        methods: {
            keyArrayFocus(e) {
                try {
                    this.$emit("keyEvent", e.target.value);
                } catch (qq) {
                    this.$emit("keyEvent", e);
                }
            },
            valArrayFocus(e) {
                try {
                    this.$emit("valEvent", e.target.value);
                } catch (qq) {
                    this.$emit("valEvent", e);
                }
            },
            keyFocus(item, e) {
                try {
                    this.$emit("keyEvent", e.target.value);
                } catch (qq) {
                    this.$emit("keyEvent", e);
                }
            },
            valFocus(item, e) {
                try {
                    this.$emit("valEvent", e.target.value);
                } catch (qq) {
                    this.$emit("valEvent", e);
                }
            },
            keyEvent(value) {
                this.$emit("keyEvent", value);
            },
            valEvent(value) {
                this.$emit("valEvent", value);
            },
            delItem: function (parentDom, item, index) {
                let vm = this
                MessageBox.confirm("确定删除该条数据吗?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.flowData.splice(index, 1);
                    if (this.hideMyBlock[index]) vm.hideMyBlock[index] = false;
                    vm.$emit("input", vm.flowData);
                }).catch(function () {

                })
            },

            closeBlock: function (index, e) {
                this.$set(
                    this.hideMyBlock,
                    index,
                    this.hideMyBlock[index] ? false : true
                );
            },

            addItem: function () {
                this.toAddItem = true;
            },

            cancelNewItem: function () {
                this.toAddItem = false;
            },

            newItem: function (obj) {
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

                if (!oj.name) {
                    Message.warning("key为必填项,不能为空!");
                    return;
                } else {
                    this.flowData.push(oj);
                    this.$emit("input", this.flowData);
                    this.cancelNewItem();
                }
            },

            keyInputBlur: function (item, e) {
                if (item.name.length <= 0) {
                    Message.warning("key为必填项,不能为空!");
                    item.name = "null";
                    e.target.focus();
                }
            },

            onDragEnd: function () {
                this.$emit("input", this.flowData);
            },

            itemTypeChange: function (item) {
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

            numberInputChange: function (item) {
                if (!item.remark) item.remark = 0;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "./assets/styles/common.less";
    @import '../node_modules/element-ui/lib/theme-chalk/index.css';
</style>
