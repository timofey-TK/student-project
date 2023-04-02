
import useSupabase from "@/lib/SupabaseClient";
import { ref } from "vue";
import axios from 'axios';

const products = ref(null),
    categories = ref([]),
    imagesList = ref([]),
    categorySelect = ref("*"),
    deletedProducts = ref(0),
    addedProducts = ref(0)


export default function UseDatabase() {
    const { supabase } = useSupabase();
    const productsRealtime = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products_realtime' },
            (payload) => {
                console.log(payload);
                if (payload.eventType == "INSERT") {
                    addedProducts.value += 1
                }
                else {
                    deletedProducts.value = payload.old
                }
                console.log(deletedProducts.value, addedProducts.value);
                getProducts()
            }
        )
        .subscribe()


    async function getProducts() {
        const { data, error } = await supabase.from("products_realtime").select("*");
        products.value = data;
        if (error) throw error;
        return data

    }

    async function getCategories() {
        const { data, error } = await supabase.from("categories").select("*");
        categories.value = data;
        if (error) throw error;
        return data

    }
    async function addNewProduct(form) {
        const { data, error } = await supabase
            .from('products_realtime')
            .insert([
                form,
            ], { upsert: false })
        if (error) throw error;
        return data
    }
    async function deleteProduct(id) {
        const { data, error } = await supabase
            .from('products_realtime')
            .delete()
            .eq('id', id)
        if (error) throw error;
        return data

    }

    async function uploadImage(file) {
        var fd = new FormData();
        fd.append("image", file);
        let result = await axios
            .post("https://api.imageban.ru/v1", fd, {
                headers: { Authorization: "TOKEN 0pD198Co5rXWGmFGxOTL" },
            })
            .then(function (res) {
                imagesList.value.push(res.data.data.link)
                return true
            })
            .catch(function (error) {
                throw error
            })
        return result
    }


    function isProductsLoaded() {
        return !!products.value
    }
    return {
        getProducts, products, getCategories, categories, addNewProduct, uploadImage, imagesList, isProductsLoaded, categorySelect, deletedProducts,
        addedProducts,
        deleteProduct

    };
}
