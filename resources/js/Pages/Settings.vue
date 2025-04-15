<template>
  <ThemeComponent>
    <NavAppComponent />
    <v-main :style="mainStyles">
      <v-container class="content-container py-10">
        <v-card class="mx-auto pa-6 rounded-xl shadow-xl" max-width="600" elevation="4">
          <v-card-title class="text-h5 font-semibold mb-4">ユーザー設定</v-card-title>
          
          <v-divider class="my-4"></v-divider>

          <v-text-field label="名前" v-model="userName" prepend-inner-icon="mdi-account" variant="outlined"
            class="mb-4"></v-text-field>
          <v-text-field label="メールアドレス" v-model="email" prepend-inner-icon="mdi-email" variant="outlined"
            class="mb-4"></v-text-field>
          <v-text-field label="パスワード" v-model="password" prepend-inner-icon="mdi-lock" type="password"
            variant="outlined" class="mb-4"></v-text-field>
          <v-text-field label="住所" v-model="address" prepend-inner-icon="mdi-home" variant="outlined"
            class="mb-4"></v-text-field>
          <v-text-field label="電話番号" v-model="phone" prepend-inner-icon="mdi-phone" variant="outlined"
            class="mb-4"></v-text-field>
          <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps"  text="確認" class="mt-4" variant="flat"></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="設定を保存前ダブルチェックお願いします">
                <v-divider></v-divider>
                <v-card-text>
                  <v-list-item required>
                    名前： {{ userName }}
                  </v-list-item>
                  <v-list-item required>
                    メールアドレス： {{ email }}
                  </v-list-item>
                  <v-list-item required>
                    パスワード： {{ password }}
                  </v-list-item>
                  <v-list-item required>
                    住所： {{ address }}
                  </v-list-item>
                  <v-list-item required>
                    電話番号： {{ phone }}
                  </v-list-item>
                  <v-divider></v-divider>
                </v-card-text>

                <v-card-actions>
                  <v-btn @click="eventSave(isActive)" color="primary">保存</v-btn>
                  <v-btn @click="isActive.value = false" color="red">削除</v-btn>
                  <v-btn text="キャンセル" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card>
      </v-container>
    </v-main>
    <FooterComponent />
  </ThemeComponent>
</template>

<script setup>
import { ref, computed } from 'vue';
import ThemeComponent from '../Components/ThemeComponent.vue';
import NavAppComponent from '../Components/NavAppComponent.vue';
import FooterComponent from '../Components/FooterComponent.vue';

// User info
const userName = ref('山田 太郎');
const email = ref('example@example.com');
const password = ref('');
const address = ref('東京都千代田区');
const phone = ref('090-1234-5678');

// Click 確認 button
const eventSave = (isActive) => {
  if (userName.value === '' || email.value === '' || password.value === '' || address.value === '' || phone.value === '') {
    alert('全てのフィールドを入力してください。');
  } else {
    saveSettings();
  }
  closeDialog(isActive);
};

// Close Dialog
const closeDialog = (isActive) => {
  isActive.value = false;
};

// Save mock
const saveSettings = () => {
  localStorage.setItem("user", JSON.stringify({
    name: userName.value,
    email: email.value,
    password: password.value,
    address: address.value,
    phone: phone.value
  }));
};
</script>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Smooth transitions for theme changes */
.v-main {
  transition: background-color 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .content-container {
    padding: 0 8px;
  }
}
</style>