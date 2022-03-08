Simplified Toast service, based on PrimeVue's Toast.
Since Design System only supports two types and fixed showing time, this service exposes a less flexible API than PrimeVues' ToastService

# Usage

- make sure y-toast is rendered somewhere (a good place to put it is App.vue)
- when you need a toast, use toast service and call 'add' to add a message to the desired position:

```vue live
<script lang="ts" setup>
import { useToast } from '@yaochn/vue-components';
const toast = useToast();

function showToast() {
  toast.add({
    position: 'top', // top | right
    title: 'Hello',
    detail: 'This is a message',
    closable: true,
  });
}
</script>
```