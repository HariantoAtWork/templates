<template>
  <Teleport to="body">
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-show="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-fill z-50"
        @click="closeModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Reset Password</h3>
              <UButton
                @click="closeModal">
                <i class="fas fa-times w-5 h-5" aria-hidden="true" />
                <span class="sr-only">Close</span>
              </UButton>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <i class="fas fa-check-circle w-5 h-5 text-green-400 mt-0.5 mr-2" aria-hidden="true" />
                <div>
                  <p class="text-sm text-green-600 font-medium">Email sent successfully!</p>
                  <p class="text-sm text-green-600 mt-1">{{ success }}</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <Icon name="uis:exclamation-circle" class="w-5 h-5 text-red-400 mt-0.5 mr-2" aria-hidden="true" />
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
            </div>

            <!-- Form or Success State -->
            <div v-if="!success">
              <!-- Instructions -->
              <div class="mb-6">
                <p class="text-sm text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <!-- Forgot Password Form -->
              <form class="space-y-4" @submit.prevent="handleForgotPassword">
                <div class="flex flex-col space-y-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email
                    Address</label>
                  <input id="email" v-model="form.email" type="email" required
                    class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email address">
                </div>

                <UButton type="submit" :disabled="loading || !form.email">
                  <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i class="fas fa-spinner fa-spin h-4 w-4 text-indigo-500" aria-hidden="true" />
                  </span>
                  {{ loading ? 'Sending...' : 'Send Reset Link' }}
                </UButton>
              </form>

              <!-- Back to Sign In -->
              <div class="mt-6 text-center">
                <UButton
                  @click="switchToSignIn">
                  <i class="fas fa-arrow-left w-4 h-4 mr-2" aria-hidden="true" />
                  Back to Sign In
                </UButton>
              </div>
            </div>

            <!-- Success State Actions -->
            <div v-else class="space-y-4">
              <div class="flex space-x-3">
                <UButton :disabled="resendLoading"
                  @click="handleResendEmail">
                  {{ resendLoading ? 'Resending...' : 'Resend Email' }}
                </UButton>

                <UButton
                  @click="switchToSignIn">
                  Back to Sign In
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'switch-to-signin'])

const { forgetPassword } = useAuth()

// Form state
const form = reactive({
  email: ''
})

const loading = ref(false)
const resendLoading = ref(false)
const error = ref('')
const success = ref('')

const closeModal = () => {
  emit('update:show', false)
  resetForm()
}

const resetForm = () => {
  form.email = ''
  error.value = ''
  success.value = ''
  loading.value = false
  resendLoading.value = false
}

const switchToSignIn = () => {
  emit('switch-to-signin')
  closeModal()
}

const handleForgotPassword = async () => {
  if (loading.value || !form.email) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const { error: forgotError } = await forgetPassword({
      email: form.email,
      redirectTo: `${window.location.origin}/auth/reset-password`
    }, {
      onRequest: () => {
        loading.value = true
      },
      onSuccess: () => {
        loading.value = false
        success.value = `We've sent a password reset link to ${form.email}. Please check your inbox and follow the instructions to reset your password.`
      },
      onError: (ctx) => {
        loading.value = false
        error.value = ctx.error.message || 'An error occurred while sending the reset email'
      }
    })

    if (forgotError) {
      error.value = forgotError.message || 'An error occurred while sending the reset email'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

const handleResendEmail = async () => {
  if (resendLoading.value || !form.email) return

  resendLoading.value = true
  error.value = ''

  try {
    const { error: resendError } = await forgetPassword({
      email: form.email,
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (resendError) {
      error.value = resendError.message || 'An error occurred while resending the email'
    } else {
      success.value = `Password reset link sent again to ${form.email}. Please check your inbox.`
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    resendLoading.value = false
  }
}

// Reset form when modal closes
watch(() => props.show, (newShow) => {
  if (!newShow) {
    resetForm()
  }
})
</script>
