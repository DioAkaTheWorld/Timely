<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

onMounted(async () => {
  auth.setApiKey('!lD,h9nvtsIG')
  await auth.loadProfile()

  console.log('Authenticated:', auth.authenticated)
  console.log('User:', auth.user)
})
</script>
