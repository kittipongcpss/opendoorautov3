<template>
  <div class="font-sans">
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div
        class="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-md rounded-md"
      >
        <div class="md:max-w-md w-full px-4 py-4">
          <form @submit.prevent="register">
            <div class="mb-12 text-center">
              <h3 class="text-gray-800 text-3xl font-extrabold">เข้าสู่ระบบ</h3>
            </div>

            <!-- Email -->
            <div>
              <label class="text-gray-800 text-base font-medium block mb-2"
                >Email</label
              >
              <div class="relative flex items-center">
                <input
                  name="email"
                  type="text"
                  required
                  class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Email"
                  v-model="email"
                />
              </div>
            </div>
            <!-- Password -->
            <div class="mt-8">
              <label class="text-gray-800 text-base font-medium block mb-2"
                >Password</label
              >
              <div class="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Enter password"
                  v-model="password"
                />
              </div>
            </div>
            <!-- Error Message -->
            <div v-if="errMsg" class="mt-4 text-red-500 text-xs">
              {{ errMsg }}
            </div>
            <!-- Sign in -->
            <div class="mt-12">
              <button
                type="submit"
                class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>

        <div class="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
          <img
            src="https://readymadeui.com/signin-image.webp"
            class="w-full h-full object-contain"
            alt="login-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref("");
const router = useRouter();

const register = async () => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Successfully signed in!", userCredential.user);
    router.push("/");
  } catch (error) {
    console.log(error.code);
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "อีเมลไม่ถูกต้อง";
        break;
      case "auth/wrong-password":
        errMsg.value = "รหัสผ่านไม่ถูกต้อง";
        break;
      default:
        errMsg.value = "อีเมล/รหัสผ่าน ไม่ถูกต้อง";
        break;
    }
  }
};
</script>
