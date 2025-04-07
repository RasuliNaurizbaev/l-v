<template>
    <v-app>
      <v-main style="min-height: 100vh; background-color: #000;">
        <v-container fluid class="pa-0">
          <v-row no-gutters class="rounded-lg overflow-hidden" style="margin: 0 auto;">
            <v-col cols="12" md="6" class="bg-black d-flex align-center justify-center">
              <div class="px-8 py-10" style="width: 100%; max-width: 440px;">
                <v-form @submit.prevent="onSubmit">
                  <h2 class="text-h5 mb-6">Login to your account</h2>
  
                  <v-text-field 
                    v-model="email" 
                    label="Email" 
                    name="email" 
                    id="email" 
                    placeholder="Email"
                    variant="outlined" 
                    prepend-inner-icon="mdi-email-outline" 
                    required
                    class="mb-3">
                  </v-text-field>
  
                  <v-text-field 
                    v-model="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    label="Password"
                    name="password" 
                    id="password" 
                    placeholder="Password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" 
                    variant="outlined"
                    required 
                    class="mb-1" 
                    @click:append-inner="togglePasswordVisibility">
                  </v-text-field>
  
                  <div class="d-flex justify-end mb-5">
                    <v-btn color="primary" variant="text" class="text-none">Forgot password?</v-btn>
                  </div>
  
                  <v-btn 
                    type="submit" 
                    color="primary" 
                    size="large" 
                    variant="flat" 
                    block
                    class="rounded-lg text-subtitle-1" 
                    height="50">
                    Login
                  </v-btn>
                </v-form>
  
                <div class="my-8 position-relative">
                  <v-divider class="mb-8"></v-divider>
                  <div class="divider-content bg-black px-4">Or continue with</div>
                </div>
  
                <v-row class="text-center justify-center align-center mb-6">
                  <v-col cols="auto">
                    <v-btn icon="mdi-google" variant="outlined" size="large" color="#D93F21"></v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn icon="mdi-facebook" variant="outlined" size="large" color="#1867C0"></v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn icon="mdi-github" variant="outlined" size="large"></v-btn>
                  </v-col>
                </v-row>
  
                <div class="text-center">
                  Don't have an account?
                  <v-btn variant="text" color="primary" class="text-none" density="comfortable">
                    Sign up
                  </v-btn>
                </div>
              </div>
            </v-col>
  
            <v-col cols="12" md="6" class="d-none d-md-block pa-0" style="height: 100vh; width: 100%;">
              <v-img
                src="https://images.unsplash.com/photo-1596003903067-bf5762ad5c19?auto=format&fit=crop&w=1470&q=80"
                cover 
                width="100%"
                height="100%"
                style="object-fit: cover;">
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const onSubmit = () => {
    console.log('Form submitted:', { email: email.value, password: password.value });
  };
  </script>
  
  <style scoped>
  .divider-content {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }
  </style>