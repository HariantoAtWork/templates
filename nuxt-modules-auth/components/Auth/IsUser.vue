<template>
  <div v-if="session?.isPending || session?.isRefetching" class="p-2">
    <UAlert color="neutral" title="Loading!!" description="Checking user session..." icon="heroicons:arrow-path" :ui="{
      icon: 'size-11 animate-spin'
    }" />
  </div>
  <template v-else>
    <slot v-if="!!session?.data?.user?.id" />
    <slot v-else name="fallback">
      <div v-if="alert" class="p-2">
        <UAlert color="error" icon="heroicons:shield-exclamation" title="Access Denied"
          description="You do not have permission to access this content. You must be logged in to access this content." />
      </div>
    </slot>
  </template>
</template>

<script setup>
defineProps({
  alert: {
    type: Boolean,
    default: false
  }
})

const { useSession } = useAuth()
const session = useSession()
</script>
