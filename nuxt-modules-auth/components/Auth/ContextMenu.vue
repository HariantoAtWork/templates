<template>
  <div ref="menuContainer" class="relative">
    <!-- Account Button -->
    <UButton class="flex items-center justify-center border-none bg-transparent text-white gap-1 px-2"
      @click="handleAccountClick">
      <!-- Authenticated User -->
      <template v-if="user">
        <!-- Account Icon -->
        <Icon name="mdi:account" class="w-4 h-4 text-inherit" />
        <span class="text-sm font-medium">{{ user?.name || user?.email || 'Account' }}</span>
        <!-- Dropdown Arrow -->
        <Icon name="mdi:chevron-down" class="w-4 h-4 text-inherit transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }" />
      </template>
      <!-- Guest User -->
      <template v-else>
        <!-- Account Icon -->
        <Icon name="mdi:account" class="w-4 h-4 text-inherit" />
        <span class="sr-only">Account</span>
      </template>
    </UButton>

    <!-- Context Menu -->
    <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <div v-show="isOpen"
        class="absolute right-1 mt-2 bg-white rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        :class="user ? 'w-48' : 'w-80'" role="menu" aria-orientation="vertical">

        <!-- Authenticated User Menu -->
        <div v-if="user" class="py-1" role="none">
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm text-gray-900 font-medium m-0">{{ user?.name || user?.email }}</p>
            <p class="text-sm text-gray-500 truncate m-0">{{ user?.email }}</p>
          </div>

          <AuthIsAdmin>
            <NuxtLink to="/admin/inboxes"
              class="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem" @click="closeMenu">
              <Icon name="mdi:gauge" class="w-4 h-4 mr-3" aria-hidden="true" />
              Admin Inboxes
            </NuxtLink>
          </AuthIsAdmin>

          <NuxtLink to="/my/inboxes"
            class="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem" @click="closeMenu">
            <Icon name="mdi:mailbox-open" class="w-4 h-4 mr-3" aria-hidden="true" />
            My Inboxes
          </NuxtLink>

          <NuxtLink to="/temp/inboxes"
            class="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem" @click="closeMenu">
            <Icon name="mdi:mail" class="w-4 h-4 mr-3" aria-hidden="true" />
            Temp Inboxes
          </NuxtLink>

          <div class="border-t border-gray-100" />

          <UButton
            class="flex items-center w-fill px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 border-none bg-transparent"
            role="menuitem" @click="handleSignOut">
            <Icon name="mdi:logout" class="w-4 h-4 mr-3" aria-hidden="true" />
            Sign Out
          </UButton>
        </div>

        <!-- Guest User Login Form -->
        <div v-else class="p-4">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 m-0">{{ activeTabTitle[activeTab] || 'Authentication' }}</h3>

            <!-- Tab Navigation -->
            <div class="flex space-x-1 bg-gray-100 p-1 rounded text-xs whitespace-nowrap">
              <UButton :class="activeTab === 'signin' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600'"
                variant="ghost" @click="activeTab = 'signin'">
                Sign In
              </UButton>
              <UButton :class="activeTab === 'signup' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600'"
                variant="ghost" @click="activeTab = 'signup'">
                Sign Up
              </UButton>
              <UButton :class="activeTab === 'forgot' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600'"
                variant="ghost" @click="activeTab = 'forgot'">
                Reset
              </UButton>

            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="error" class="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <p class="text-red-600">{{ error }}</p>
          </div>

          <!-- Success Messages -->
          <div v-if="success" class="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
            <p class="text-green-600">{{ success }}</p>
          </div>

          <!-- Sign In Form -->
          <form v-if="activeTab === 'signin'" class="flex flex-col space-y-2" @submit.prevent="handleSignIn">
            <UInput v-model="signinForm.email" type="email" required class="input-text" placeholder="Email address" />
            <UInput v-model="signinForm.password" type="password" required class="input-text" placeholder="Password" />
            <UCheckbox default-value v-model="signinForm.rememberMe" type="checkbox" label="Remember me" />
            <UButton type="submit" :disabled="signinLoading || !isSigninFormValid">
              {{ signinLoading ? 'Signing In...' : 'Sign In' }}
            </UButton>
          </form>

          <!-- Sign Up Form -->
          <form v-else-if="activeTab === 'signup'" class="flex flex-col space-y-2" @submit.prevent="handleSignUp">
            <UInput v-model="signupForm.name" type="text" required class="input-text" placeholder="Full name" />
            <UInput v-model="signupForm.email" type="email" required class="input-text" placeholder="Email address" />
            <UInput v-model="signupForm.password" type="password" required minlength="8" class="input-text" placeholder="Password (min. 8 chars)" />
            <UInput v-model="signupForm.confirmPassword" type="password" required class="input-text" placeholder="Confirm password" />
            <UCheckbox v-model="signupForm.acceptTerms" type="checkbox" required label="I agree to the Terms" />

            <label for="terms" class="ml-2 text-xs text-gray-900 hidden">
              I agree to the <a href="/terms" class="text-indigo-600 hover:text-indigo-500">Terms</a>
            </label>

            <UButton type="submit" :disabled="signupLoading || !isSignupFormValid">
              {{ signupLoading ? 'Creating Account...' : 'Create Account' }}
            </UButton>
          </form>

          <!-- Forgot Password Form -->
          <form v-else-if="activeTab === 'forgot'" class="flex flex-col space-y-2"
            @submit.prevent="handleForgotPassword">
            <UFormField class="flex flex-col space-y-2 font-normal" label="Enter your email to reset your password.">
              <UInput v-model="forgotForm.email" type="email" class="input-text w-full" required placeholder="Email address" />
            </UFormField>
            <UButton type="submit" :disabled="forgotLoading || !forgotForm.email">
              {{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}
            </UButton>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'

const { useSession, signOut, signIn, signUp, forgetPassword } = useAuth()
// Auth state
const session = useSession()
const user = computed(() => session.value?.data?.user || null)

// Menu state
const isOpen = ref(false)
const menuContainer = ref(null)

// Tab state
const activeTab = ref('signin')
const activeTabTitle = {
  signin: 'Sign In',
  signup: 'Sign Up',
  forgot: 'Reset'
}

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

// Messages
const error = ref('')
const success = ref('')

// Computed properties for safe access
const currentUser = computed(() => {
  return session.data?.user || null
})

const isSigninFormValid = computed(() => {
  return signinForm.email
})

// Computed property for signup form validity
const isSignupFormValid = computed(() => {
  return signupForm.name &&
    signupForm.email &&
    signupForm.password &&
    signupForm.confirmPassword &&
    signupForm.password === signupForm.confirmPassword &&
    signupForm.password.length >= 8 &&
    signupForm.acceptTerms
})

const handleAccountClick = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
  // Reset forms when closing
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
      callbackURL: `/my/inboxes`
    }, {
      onRequest: () => {
        signinLoading.value = true
      },
      onSuccess: () => {
        signinLoading.value = false
        closeMenu()
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
      callbackURL: `/`
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
        success.value = `We've sent a password reset link to ${forgotForm.email}. Please check your inbox.`
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

const handleSignOut = async () => {
  try {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          closeMenu()
          // Redirect to home page after sign out
          navigateTo('/')
        },
      },
    })
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
