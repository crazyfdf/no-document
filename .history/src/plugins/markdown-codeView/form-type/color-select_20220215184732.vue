<template>
  <div>
    <el-cascader v-bind="componentProps" v-model="color" @change="change">
      <template #default="{ node, data }">
        <div :style="node.isLeaf && style(data.label, 1)">{{ _label(data.label, 0) }}</div>
      </template>
    </el-cascader>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(["input"]);
const props = defineProps({
  componentProps: {
    type: Object,
    default: () => ({}),
  },
  value: {
    type: Array,
    default: () => [],
  },
});
const color = ref(props.value);
const _label = (label, index) => {
  return label.split(" ")[index];
};
const style = (label, index) => ({
  width: "100%",
  height: "100%",
  backgroundColor: _label(label, index),
});
function change(_value) {
  emit("input", _value.join(""));
}
</script>
