<template>
    <div class="login">
        <div class="form-item">
            <label for="username">USER NAME</label>
            <input
                id="username"
                autocomplete="off"
                type="text"
                v-model="username"
            >
        </div>
        <!-- div class="form-item">
            <label for="password">Password</label>
            <input
                id="password"
                autocomplete="off"
                type="password"
                v-model="password"
            >
        </div -->
        <div class="form-item">
            <button class="button" @click="userLogin()">Login</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login }  from '../firebase/user';
import { useRouter } from 'vue-router'

const username= ref("");
const router = useRouter();

const userLogin = async function(){

    try {
        login(username.value, router , 'map');
    } catch (error) {
        alert(`login error ${error}`);
    }

}
</script>

<style scoped>
.form-item {
    margin: 0 auto;
    text-align: center;
}

label {
    display: block;
}

input {
    width: 50%;
    padding: .5em;
    font: inherit;
}

button {
    padding: 0.5em;
    margin: 1em;
}
</style>