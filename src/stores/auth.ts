import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MockUser } from "@/types/roles";
import { mockUsers } from "@/types/roles";
import { useToastStore } from "@/stores/toast";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<MockUser | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  function init() {
    const stored = localStorage.getItem("ecomed_user");
    if (stored) {
      try {
        user.value = JSON.parse(stored);
      } catch {
        localStorage.removeItem("ecomed_user");
      }
    }
    loading.value = false;
  }

  function login(email: string, password: string): boolean {
    const toast = useToastStore();
    const found = mockUsers.find((u) => u.email === email);
    if (found && password === "1234") {
      user.value = found;
      localStorage.setItem("ecomed_user", JSON.stringify(found));
      toast.show({ title: "Bienvenido/a", description: `Sesión iniciada como ${found.name}` });
      return true;
    }
    toast.show({ title: "Error de autenticación", description: "Email o contraseña incorrectos", variant: "destructive" });
    return false;
  }

  function logout() {
    const toast = useToastStore();
    user.value = null;
    localStorage.removeItem("ecomed_user");
    toast.show({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente" });
  }

  return { user, loading, isAuthenticated, init, login, logout };
});
