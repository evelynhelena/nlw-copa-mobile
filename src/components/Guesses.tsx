import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId , code}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState<string>('');
  const [secondeTeamPoints, setSecondeTeamPoints] = useState<string>('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/pools/${poolId}/games`);
      setGames(data.games);
      console.log(data.games);

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

  async function handleGuessConfirm(gameId: string) {
    setIsLoading(true);
    try {
      if (!firstTeamPoints.trim() || !secondeTeamPoints.trim()) {
        return toast.show({
          title: "Informe o palpite",
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondeTeamPoints)
      });

      toast.show({
        title: "Palpite Enviado com sucesso",
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames();

    } catch (e) {
      console.log(e);
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
    fetchGames();
  }, [poolId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondeTeamPoints}
          onGuessConfirm={() => { handleGuessConfirm(item.id) }}
        />
      )}
      _contentContainerStyle={{pb: 10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
