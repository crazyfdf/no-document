<template>
  <Menu :model="items" />
  <div class="y-body">
    <slot name="header" />
    <slot />
  </div>
</template>
<script lang="ts" setup>
import Menu from "primevue/menu";
const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Update",
        icon: "pi pi-refresh",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Updated",
            detail: "Data Updated",
            life: 3000,
          });
        },
      },
      {
        label: "Delete",
        icon: "pi pi-times",
        command: () => {
          toast.add({ severity: "warn", summary: "Delete", detail: "Data Deleted", life: 3000 });
        },
      },
    ],
  },
  {
    label: "Navigate",
    items: [
      {
        label: "Vue Website",
        icon: "pi pi-external-link",
        url: "https://vuejs.org/",
      },
      {
        label: "Router",
        icon: "pi pi-upload",
        command: () => {
          window.location.hash = "/fileupload";
        },
      },
    ],
  },
]);
</script>
<style scoped>
.y-body {
  padding: 4rem;
}
</style>
