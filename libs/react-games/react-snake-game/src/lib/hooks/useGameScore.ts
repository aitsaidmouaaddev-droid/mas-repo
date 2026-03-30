import { useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useDispatch, useSelector } from 'react-redux';
import { setBestScore } from '../snake.slice';
import type { RootState } from './useSnakeGame.types';

const SNAKE_GAME_UNIQUE_NAME = 'snake';

const FIND_GAME = gql`
  query FindSnakeGame($filter: String!) {
    findByGame(filter: $filter) {
      id
    }
  }
`;

const FIND_GAME_SCORE = gql`
  query FindSnakeGameScore($filter: String!) {
    findByGameScore(filter: $filter) {
      id
      bestScore
    }
  }
`;

const CREATE_GAME_SCORE = gql`
  mutation CreateSnakeScore($gameId: ID!, $bestScore: Int!) {
    createGameScore(input: { gameId: $gameId, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;

const UPDATE_GAME_SCORE = gql`
  mutation UpdateSnakeScore($id: ID!, $bestScore: Int!) {
    updateGameScore(input: { id: $id, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;

const REGISTER_GAME = gql`
  mutation RegisterSnakeGame($uniqueName: String!) {
    createGame(input: { uniqueName: $uniqueName, hasScore: true, hasProgress: false }) {
      id
    }
  }
`;

export function useGameScore() {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.snake.status);
  const score = useSelector((s: RootState) => s.snake.score);
  const prevStatus = useRef(status);

  // Step 1 — find the Game row
  const { data: gameData, refetch: refetchGame } = useQuery<{ findByGame: { id: string }[] }>(
    FIND_GAME,
    {
      variables: { filter: JSON.stringify({ uniqueName: SNAKE_GAME_UNIQUE_NAME }) },
      fetchPolicy: 'cache-and-network',
    },
  );

  const gameId: string | undefined = gameData?.findByGame?.[0]?.id;

  const [registerGame] = useMutation(REGISTER_GAME);

  // Register game if it doesn't exist yet, then refetch to get the new id
  useEffect(() => {
    if (gameData && !gameId) {
      registerGame({ variables: { uniqueName: SNAKE_GAME_UNIQUE_NAME } }).then(() => refetchGame());
    }
  }, [gameData, gameId, registerGame, refetchGame]);

  // Step 2 — find the GameScore row for this user + game
  const { data: scoreData, refetch: refetchScore } = useQuery<{
    findByGameScore: { id: string; bestScore: number }[];
  }>(FIND_GAME_SCORE, {
    variables: { filter: JSON.stringify({ gameId }) },
    skip: !gameId,
    fetchPolicy: 'cache-and-network',
  });

  const scoreRow = scoreData?.findByGameScore?.[0];

  // Hydrate Redux with the persisted best score
  useEffect(() => {
    if (scoreRow?.bestScore != null) {
      dispatch(setBestScore(scoreRow.bestScore));
    }
  }, [scoreRow, dispatch]);

  const [createScore] = useMutation(CREATE_GAME_SCORE);
  const [updateScore] = useMutation(UPDATE_GAME_SCORE);

  // Persist on death — isolated so prevStatus only updates on status change
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
