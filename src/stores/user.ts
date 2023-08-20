import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {user} from '../firebase/types/usertype'

export const useUserStore = defineStore('user', () => {

  const user = ref({} as user) ;
  
  const setUser = (in_user: user) => {
    user.value  = in_user;
    console.log(`set user ${in_user}`);
  }

  return { user, setUser }
})