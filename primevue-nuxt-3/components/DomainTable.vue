<template>
  <div>
    <Toast />
    <DataTable
      :value="tableData"
      :paginator="true"
      :rows="10"
      dataKey="domain"
      :rowHover="true"
      v-model:selection="selectedDomains"
      :filters="filters"
      sortMode="multiple"
      filterDisplay="menu"
      class="mt-4"
    >
      <Column field="domain" header="Domain" sortable>
        <template #body="{ data }">
          {{ data.domain }}
        </template>
      </Column>

      <Column field="fulldomain" header="Full Domain" sortable>
        <template #body="{ data }">
          {{ data.details.fulldomain }}
        </template>
      </Column>

      <Column field="username" header="Username" sortable>
        <template #body="{ data }">
          {{ data.details.username }}
        </template>
      </Column>

      <Column field="server_url" header="Server URL" sortable>
        <template #body="{ data }">
          {{ data.details.server_url }}
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDelete(data.domain)"
            text
            rounded
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Delete"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete {{ domainToDelete }}?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="deleteDialog = false"
          text
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          @click="deleteDomain"
          severity="danger"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const tableData = ref([])
const selectedDomains = ref([])
const filters = ref({})
const deleteDialog = ref(false)
const domainToDelete = ref(null)

const loadData = async () => {
  try {
    const response = await fetch('/api/clientstorage')
    const data = await response.json()
    tableData.value = Object.entries(data).map(([domain, details]) => ({
      domain,
      details,
    }))
  } catch (error) {
    console.error('Error loading data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load data',
      life: 3000,
    })
  }
}

const confirmDelete = (domain) => {
  domainToDelete.value = domain
  deleteDialog.value = true
}

const deleteDomain = async () => {
  try {
    const response = await fetch(`/api/clientstorage/${domainToDelete.value}`, {
      method: 'DELETE',
    })
    const result = await response.json()

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: result.message,
        life: 3000,
      })
      await loadData()
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error deleting domain:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete domain',
      life: 3000,
    })
  }
  deleteDialog.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style>
.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
