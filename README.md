# vue-json-editable

> Visual JSON Editor built as an vue component. Provides a basic GUI


</br>



## 开始
```
npm install vue-json-editable --save
```

</br>


## 使用

``` javascript
//import it in your project At your entry point

import Vue from 'vue'
import JsonEditor from 'vue-json-editable'
  
Vue.use(JsonEditor)
```
### 参数

* objData: json data
* options
    * confirmText: strings of the confirm button
    * cancelText: strings of the cancel button
* event
    * key click event
    * value click event


</br>

## 样例

``` html

<template>
    <JsonEditor
        :options="{
            confirmText: '确认',
            cancelText: '取消',
        }"
        @keyEvent="keyEvent"
        @valEvent="valEvent"
        :objData="jsonData" 
        v-model="jsonData" >
    </JsonEditor>
</template>
<script>
export default {
    ...
    data: function() {
        return {
            jsonData: {
                name: 'Bill',
                age: 23,
                city: 'Seattle'
            }
        }
    }
}
</script> 
```

</br>



