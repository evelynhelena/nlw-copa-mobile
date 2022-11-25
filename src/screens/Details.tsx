import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export function Details() {
    const [optionSelected, setOptionSelected] = useState<'guess' | 'ranking'>('guess');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);
    const route = useRoute();
    const { id } = route.params as RouteParams;
    const toast = useToast();

    async function featchPoolDetails() {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/pools/${id}`);
            setPoolDetails(data.pool)

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

    async function handleCodeShare(){
       await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(() => {
        featchPoolDetails()
    }, [id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
              title={poolDetails.title}
              handleCodeShare={handleCodeShare}
              showBackButton
              showShareButton />
            {
                poolDetails._count?.participant > 0
                    ?
                    <VStack px={5} flex={1} bgColor="gray.900">
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option
                              title="Seus Palpites"
                              isSelected={optionSelected === 'guess'}
                              onPress={() => setOptionSelected('guess')} />
                            <Option
                              title="Ranking do grupo"
                              isSelected={optionSelected === 'ranking'}
                              onPress={() => setOptionSelected('ranking')} />
                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                    </VStack>

                    :
                    <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    )
}