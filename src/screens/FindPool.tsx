import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useCallback, useState } from "react";
import { api } from "../services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export function FindPool() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const toast = useToast();
    const { navigate } = useNavigation();

    async function handleJoinPool() {
        try {
            setIsLoading(true);
            if (!code.trim()) {
                return toast.show({
                    title: "Informe um codigo",
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            await api.post('/pools/join', { code: code.toUpperCase() });
            navigate('pools');
        } catch (e) {
            setIsLoading(false);
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
        } 
    }

    useFocusEffect(useCallback(() => {
        setCode('');
        setIsLoading(false);
    }, []));

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de {'\n'} seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    onChangeText={setCode}
                    autoCapitalize="characters" />

                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onPress={handleJoinPool} />
            </VStack>
        </VStack>
    )
}