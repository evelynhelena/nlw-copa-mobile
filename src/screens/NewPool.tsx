import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useState } from "react";

export function NewPool() {
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsUserLoading] = useState<boolean>(false);

    const toast = useToast();

    async function handlePoolCreate() {
        if (!title.trim()) {
            return toast.show({
                title: "informe um nome para o seu bolão",
                placement: 'top',
                bgColor: "red.500"
            })
        }

        try {
            setIsUserLoading(true);
            await api.post('/pools', { title })
            toast.show({
                title: "Bolao criado com sucesso!",
                placement: 'top',
                bgColor: "green.500"
            })
            setTitle('');
        } catch (e) {
            console.log(e);
            toast.show({
                title: "Não foi possivel criar o bolão",
                placement: 'top',
                bgColor: "red.500"
            })
        } finally {
            setIsUserLoading(false);
        }

        /* await api.post(); */
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Logo />

                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
                </Heading>

                <Input mb={2} placeholder="Qual o nome do seu bolão" value={title} onChangeText={setTitle} />

                <Button title="criar meu bolão" onPress={handlePoolCreate} isLoading={isLoading} />

                <Text color="gray.200" fontSize="sm" textAlign="center" mt={4} px={10}>
                    Após criar seu bolão, você receberá um código único que
                    poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}