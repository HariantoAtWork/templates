<template>
    <Teleport to="body">
        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-show="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-fill z-50"
                @click="closeModal">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-medium text-gray-900">Sign In</h3>
                            <UButton
                                class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                                @click="closeModal">
                                <i class="fas fa-times w-5 h-5" aria-hidden="true" />
                                <span class="sr-only">Close</span>
                            </UButton>
                        </div>

                        <!-- Error Message -->
                        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p class="text-sm text-red-600">{{ error }}</p>
                        </div>

                        <!-- Sign In Form -->
                        <form class="space-y-4" @submit.prevent="handleSignIn">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                                <input id="email" v-model="form.email" type="email" required
                                    class="mt-1 appearance-none relative block w-fill px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your email">
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                                <div class="mt-1 relative">
                                    <input id="password" v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'" required
                                        class="appearance-none relative block w-fill px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your password">
                                    <UButton type="button"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        @click="showPassword = !showPassword">
                                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="w-4 h-4"
                                            aria-hidden="true" />
                                    </UButton>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember
                                        me</label>
                                </div>

                                <UButton type="button" class="text-sm text-indigo-600 hover:text-indigo-500"
                                    @click="switchToForgotPassword">
                                    Forgot password?
                                </UButton>
                            </div>

                            <UButton type="submit" :disabled="loading"
                                class="group relative w-fill flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i class="fas fa-spinner fa-spin h-4 w-4 text-indigo-500" aria-hidden="true" />
                                </span>
                                {{ loading ? 'Signing In...' : 'Sign In' }}
                            </UButton>
                        </form>

                        <!-- Switch to Sign Up -->
                        <div class="mt-6 text-center">
                            <p class="text-sm text-gray-600">
                                Don't have an account?
                                <UButton class="font-medium text-indigo-600 hover:text-indigo-500"
                                    @click="switchToSignUp">
                                    Create one now
                                </UButton>
                            </p>
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

const emit = defineEmits(['update:show', 'switch-to-signup', 'switch-to-forgot-password'])

const { signIn } = useAuth()

// Form state
const form = reactive({
    email: '',
    password: '',
    rememberMe: true
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const closeModal = () => {
    emit('update:show', false)
    resetForm()
}

const resetForm = () => {
    form.email = ''
    form.password = ''
    form.rememberMe = true
    error.value = ''
    showPassword.value = false
}

const switchToSignUp = () => {
    emit('switch-to-signup')
    closeModal()
}

const switchToForgotPassword = () => {
    emit('switch-to-forgot-password')
    closeModal()
}

const handleSignIn = async () => {
    if (loading.value) return

    loading.value = true
    error.value = ''

    try {
        const { error: signInError } = await signIn.email({
            email: form.email,
            password: form.password,
            rememberMe: form.rememberMe,
            callbackURL: '/admin/inboxes'
        }, {
            onRequest: () => {
                loading.value = true
            },
            onSuccess: () => {
                loading.value = false
                closeModal()
                // Navigation will be handled by callbackURL
            },
            onError: (ctx) => {
                loading.value = false
                error.value = ctx.error.message || 'An error occurred during sign in'
            }
        })

        if (signInError) {
            error.value = signInError.message || 'An error occurred during sign in'
        }
    } catch (err) {
        error.value = err.message || 'An unexpected error occurred'
    } finally {
        loading.value = false
    }
}

// Reset form when modal closes
watch(() => props.show, (newShow) => {
    if (!newShow) {
        resetForm()
    }
})
</script>
