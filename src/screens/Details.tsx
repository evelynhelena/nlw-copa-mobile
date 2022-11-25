import { useRoute } from "@react-navigation/native";
import { useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export function Details() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const route = useRoute();
    const { id } = route.params as RouteParams;
    const toast = useToast();

    async function featchPoolDetails() {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/pools/${id}`);

            console.log(data);

        } catch (e) {
            if (e.response?.data?.message) {
                return toast.show({
                    title: e.response?.data?.message,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            } else {
                return toast.show({
                    title: "ERRO",
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        featchPoolDetails()
    },[id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={id} showBackButton showShareButton />

        </VStack>
    )
}