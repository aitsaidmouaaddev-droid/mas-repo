import { useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useDispatch, useSelector } from 'react-redux';
import { setBestScore } from '../flappy.slice';
import type { RootState } from './useFlappyGame.types';

const FLAPPY_GAME_UNIQUE_NAME = 'flappy-bird';

const FIND_GAME = gql`
  query FindFlappyGame($filter: String!) {
    findByGame(filter: $filter) {
      id
    }
  }
`;

const FIND_GAME_SCORE = gql`
  query FindFlappyGameScore($filter: String!) {
    findByGameScore(filter: $filter) {
      id
      bestScore
    }
  }
`;

const CREATE_GAME_SCORE = gql`
  mutation CreateFlappyScore($gameId: ID!, $bestScore: Int!) {
    createGameScore(input: { gameId: $gameId, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;

const UPDATE_GAME_SCORE = gql`
  mutation UpdateFlappyScore($id: ID!, $bestScore: Int!) {
    updateGameScore(input: { id: $id, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;

const REGISTER_GAME = gql`
  mutation RegisterFlappyGame($uniqueName: String!) {
    createGame(input: { uniqueName: $uniqueName, hasScore: true, hasProgress: false }) {
      id
    }
  }
`;

export function useGameScore() {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.flappy.status);
  const score = useSelector((s: RootState) => s.flappy.score);
  const prevStatus = useRef(status);

  const { data: gameData, refetch: refetchGame } = useQuery<{ findByGame: { id: string }[] }>(
    FIND_GAME,
    {
      variables: { filter: JSON.stringify({ uniqueName: FLAPPY_GAME_UNIQUE_NAME }) },
      fetchPolicy: 'cache-and-network',
    },
  );

  const gameId: string | undefined = gameData?.findByGame?.[0]?.id;

  const [registerGame] = useMutation(REGISTER_GAME);

  useEffect(() => {
    if (gameData && !gameId) {
      registerGame({ variables: { uniqueName: FLAPPY_GAME_UNIQUE_NAME } }).then(() =>
        refetchGame(),
      );
    }
  }, [gameData, gameId, registerGame, refetchGame]);

  const { data: scoreData, refetch: refetchScore } = useQuery<{
    findByGameScore: { id: string; bestScore: number }[];
  }>(FIND_GAME_SCORE, {
    variables: { filter: JSON.stringify({ gameId }) },
    skip: !gameId,
    fetchPolicy: 'cache-and-network',
  });

  const scoreRow = scoreData?.findByGameScore?.[0];

  useEffect(() => {
    if (scoreRow?.bestScore != null) {
      dispatch(setBestScore(scoreRow.bestScore));
    }
  }, [scoreRow, dispatch]);

  const [createScore] = useMutation(CREATE_GAME_SCORE);
  const [updateScore] = useMutation(UPDATE_GAME_SCORE);

  useEffect(() => {
    if (status === 'dead' && prevStatus.current === 'running' && gameId) {
      const currentBest = scoreRow?.bestScore ?? 0;
      if (score > currentBest) {
        const save = scoreRow?.id
          ? updateScore({ variables: { id: scoreRow.id, bestScore: score } })
          : createScore({ variables: { gameId, bestScore: score } });
        save.then(() => refetchScore());
      }
    }
    prevStatus.current = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
}
