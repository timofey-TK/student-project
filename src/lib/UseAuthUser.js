import { ref } from "vue";
import useSupabase from "@/lib/SupabaseClient";

const user = ref(null);
export default function useAuthUser() {
    const { supabase } = useSupabase();
    // Login
    const login = async ({ email, password }) => {
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return user;
    };
    // logout
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };
    // isLoggedIn
    const isLoggedIn = () => {
        return !!user.value;
    };
    // register
    const register = async ({ email, password, name }) => {
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                },
            },
        })
        if (error) throw error;
        return user;
    };
    // // update
    // const update = async (data) => {
    //     const { user, error } = await supabase.auth.update(data);
    //     if (error) throw error;
    //     return user;
    // };
    // const sendPasswordRestEmail = async (email) => {
    //     const { user, error } = await supabase.auth.api.resetPasswordForEmail(email);
    //     if (error) throw error;
    //     return user;
    // };
    return {
        user,
        login,
        isLoggedIn,
        logout,
        register,
        // update,
        // sendPasswordRestEmail,
    };
}
