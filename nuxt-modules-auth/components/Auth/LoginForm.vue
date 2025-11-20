<template>
  <Teleport to="body">
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-show="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-fill z-50"
        @click="closeModal">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3">
            <!-- Header with Tabs -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Account</h3>
                <UButton
                  class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                  @click="closeModal">
                  <i class="fas fa-times w-5 h-5" aria-hidden="true" />
                  <span class="sr-only">Close</span>
                </UButton>
              </div>

              <!-- Tab Navigation -->
              <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <UButton :class="[
                  'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'signin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]" @click="activeTab = 'signin'">
                  Sign In
                </UButton>
                <UButton :class="[
                  'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'signup'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]" @click="activeTab = 'signup'">
                  Sign Up
                </UButton>
                <UButton :class="[
                  'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'forgot'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]" @click="activeTab = 'forgot'">
                  Reset
                </UButton>
              </div>
            </div>

            <!-- Success Messages -->
            <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <Icon name="mdi:check-circle" class="w-5 h-5 text-green-400 mt-0.5 mr-2" />
                <p class="text-sm text-green-600">{{ success }}</p>
              </div>
            </div>

            <!-- Error Messages -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <Icon name="mdi:exclamation-circle" class="w-5 h-5 text-red-400 mt-0.5 mr-2" />
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
            </div>

            <!-- Sign In Form -->
            <form v-if="activeTab === 'signin'" class="space-y-4" @submit.prevent="handleSignIn">
              <div>
                <label for="signin-email" class="block text-sm font-medium text-gray-700">Email
                  Address</label>
                <input id="signin-email" v-model="signinForm.email" type="email" required
                  class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email">
              </div>

              <div>
                <label for="signin-password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="mt-1 relative">
                  <input id="signin-password" v-model="signinForm.password"
                    :type="showSigninPassword ? 'text' : 'password'" required
                    class="appearance-none relative block w-fill px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your password">
                  <UButton type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    @click="showSigninPassword = !showSigninPassword">
                    <i :class="showSigninPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="w-4 h-4"
                      aria-hidden="true" />
                  </UButton>
                </div>
              </div>

              <div class="flex items-center">
                <input id="remember-me" v-model="signinForm.rememberMe" type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>

              <UButton type="submit" :disabled="signinLoading"
                class="group relative w-fill flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="signinLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon name="mdi:spinner" class="h-4 w-4 text-indigo-500" aria-hidden="true" animate="spin" />
                </span>
                {{ signinLoading ? 'Signing In...' : 'Sign In' }}
              </UButton>
            </form>

            <!-- Sign Up Form -->
            <form v-else-if="activeTab === 'signup'" class="space-y-4" @submit.prevent="handleSignUp">
              <div>
                <label for="signup-name" class="block text-sm font-medium text-gray-700">Full
                  Name</label>
                <input id="signup-name" v-model="signupForm.name" type="text" required
                  class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name">
              </div>

              <div>
                <label for="signup-email" class="block text-sm font-medium text-gray-700">Email
                  Address</label>
                <input id="signup-email" v-model="signupForm.email" type="email" required
                  class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email">
              </div>

              <div>
                <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="mt-1 relative">
                  <input id="signup-password" v-model="signupForm.password"
                    :type="showSignupPassword ? 'text' : 'password'" required minlength="8"
                    class="appearance-none relative block w-fill px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your password (min. 8 characters)">
                  <UButton type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    @click="showSignupPassword = !showSignupPassword">
                    <Icon :name="showSignupPassword ? 'mdi:eye-off' : 'mdi:eye'" class="w-4 h-4" aria-hidden="true" />
                  </UButton>
                </div>
                <p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>

              <div>
                <label for="signup-confirm-password" class="block text-sm font-medium text-gray-700">Confirm
                  Password</label>
                <div class="mt-1 relative">
                  <input id="signup-confirm-password" v-model="signupForm.confirmPassword"
                    :type="showSignupConfirmPassword ? 'text' : 'password'" required
                    class="appearance-none relative block w-fill px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm your password">
                  <UButton type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    @click="showSignupConfirmPassword = !showSignupConfirmPassword">
                    <Icon :name="showSignupConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" class="w-4 h-4"
                      aria-hidden="true" />
                  </UButton>
                </div>
              </div>

              <div class="flex items-center">
                <input id="terms" v-model="signupForm.acceptTerms" type="checkbox" required
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                <label for="terms" class="ml-2 block text-sm text-gray-900">
                  I agree to the
                  <a href="/terms" class="text-indigo-600 hover:text-indigo-500" target="_blank">Terms
                    of Service</a>
                  and
                  <a href="/privacy" class="text-indigo-600 hover:text-indigo-500" target="_blank">Privacy Policy</a>
                </label>
              </div>

              <UButton type="submit" :disabled="signupLoading || !isSignupFormValid"
                class="group relative w-fill flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="signupLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon name="mdi:spinner" class="h-4 w-4 text-indigo-500" aria-hidden="true" animate="spin" />
                </span>
                {{ signupLoading ? 'Creating Account...' : 'Create Account' }}
              </UButton>
            </form>

            <!-- Forgot Password Form -->
            <form v-else-if="activeTab === 'forgot'" class="space-y-4" @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <p class="text-sm text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div>
                <label for="forgot-email" class="block text-sm font-medium text-gray-700">Email
                  Address</label>
                <input id="forgot-email" v-model="forgotForm.email" type="email" required
                  class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email address">
              </div>

              <UButton type="submit" :disabled="forgotLoading || !forgotForm.email"
                class="group relative w-fill flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="forgotLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon name="mdi:spinner" class="h-4 w-4 text-indigo-500" aria-hidden="true" animate="spin" />
                </span>
                {{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}
              </UButton>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'success'])

const { signIn, signUp, forgetPassword } = useAuth()

// Tab state
const activeTab = ref('signin')

// Form states
const signinForm = reactive({
  email: '',
  password: '',
  rememberMe: true
})

const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const forgotForm = reactive({
  email: ''
})

// Loading states
const signinLoading = ref(false)
const signupLoading = ref(false)
const forgotLoading = ref(false)

// UI states
const showSigninPassword = ref(false)
const showSignupPassword = ref(false)
const showSignupConfirmPassword = ref(false)

// Messages
const error = ref('')
const success = ref('')

// Computed
const isSignupFormValid = computed(() => {
  return signupForm.name &&
    signupForm.email &&
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.password === signupForm.confirmPassword &&
    signupForm.password.length >= 8 &&
    signupForm.acceptTerms
})

const closeModal = () => {
  emit('update:show', false)
  resetForms()
}

const resetForms = () => {
  // Reset signin form
  signinForm.email = ''
  signinForm.password = ''
  signinForm.rememberMe = true

  // Reset signup form
  signupForm.name = ''
  signupForm.email = ''
  signupForm.password = ''
  signupForm.confirmPassword = ''
  signupForm.acceptTerms = false

  // Reset forgot form
  forgotForm.email = ''

  // Reset states
  activeTab.value = 'signin'
  error.value = ''
  success.value = ''
  showSigninPassword.value = false
  showSignupPassword.value = false
  showSignupConfirmPassword.value = false
}

const handleSignIn = async () => {
  if (signinLoading.value) return

  signinLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const { error: signInError } = await signIn.email({
      email: signinForm.email,
      password: signinForm.password,
      rememberMe: signinForm.rememberMe,
      callbackURL: '/admin/inboxes'
    }, {
      onRequest: () => {
        signinLoading.value = true
      },
      onSuccess: () => {
        signinLoading.value = false
        emit('success')
        closeModal()
      },
      onError: (ctx) => {
        signinLoading.value = false
        error.value = ctx.error.message || 'An error occurred during sign in'
      }
    })

    if (signInError) {
      error.value = signInError.message || 'An error occurred during sign in'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    signinLoading.value = false
  }
}

const handleSignUp = async () => {
  if (signupLoading.value || !isSignupFormValid.value) return

  // Check password match
  if (signupForm.password !== signupForm.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  signupLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const { error: signUpError } = await signUp.email({
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name,
      callbackURL: '/admin/inboxes'
    }, {
      onRequest: () => {
        signupLoading.value = true
      },
      onSuccess: () => {
        signupLoading.value = false
        success.value = 'Account created successfully! Please check your email to verify your account.'
        // Switch to signin tab after a delay
        setTimeout(() => {
          activeTab.value = 'signin'
          success.value = ''
        }, 3000)
      },
      onError: (ctx) => {
        signupLoading.value = false
        error.value = ctx.error.message || 'An error occurred during account creation'
      }
    })

    if (signUpError) {
      error.value = signUpError.message || 'An error occurred during account creation'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    signupLoading.value = false
  }
}

const handleForgotPassword = async () => {
  if (forgotLoading.value || !forgotForm.email) return

  forgotLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const { error: forgotError } = await forgetPassword({
      email: forgotForm.email,
      redirectTo: `${window.location.origin}/auth/reset-password`
    }, {
      onRequest: () => {
        forgotLoading.value = true
      },
      onSuccess: () => {
        forgotLoading.value = false
        success.value = `We've sent a password reset link to ${forgotForm.email}. Please check your inbox and follow the instructions to reset your password.`
      },
      onError: (ctx) => {
        forgotLoading.value = false
        error.value = ctx.error.message || 'An error occurred while sending the reset email'
      }
    })

    if (forgotError) {
      error.value = forgotError.message || 'An error occurred while sending the reset email'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    forgotLoading.value = false
  }
}

// Reset forms when modal closes
watch(() => props.show, (newShow) => {
  if (!newShow) {
    resetForms()
  }
})

// Clear messages when switching tabs
watch(activeTab, () => {
  error.value = ''
  success.value = ''
})
</script>
