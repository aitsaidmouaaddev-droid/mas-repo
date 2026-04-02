import { useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProgress, setBestScore } from '../platform.slice';
import type { RootState } from './usePlatformerGame.types';
import { getCharacter } from '../characters/character.registry';

const UNIQUE_NAME = 'moroccan-runner';

const FIND_GAME = gql`
  query FindMoroccanGame($filter: String!) {
    findByGame(filter: $filter) {
      id
    }
  }
`;
const REGISTER_GAME = gql`
  mutation RegisterMoroccanGame($uniqueName: String!) {
    createGame(input: { uniqueName: $uniqueName, hasScore: true, hasProgress: true }) {
      id
    }
  }
`;
const FIND_SCORE = gql`
  query FindMoroccanScore($filter: String!) {
    findByGameScore(filter: $filter) {
      id
      bestScore
    }
  }
`;
const CREATE_SCORE = gql`
  mutation CreateMoroccanScore($gameId: ID!, $bestScore: Int!) {
    createGameScore(input: { gameId: $gameId, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;
const UPDATE_SCORE = gql`
  mutation UpdateMoroccanScore($id: ID!, $bestScore: Int!) {
    updateGameScore(input: { id: $id, bestScore: $bestScore }) {
      id
      bestScore
    }
  }
`;
const FIND_PROGRESS = gql`
  query FindMoroccanProgress($filter: String!) {
    findByGameProgress(filter: $filter) {
      id
      data
    }
  }
`;
const CREATE_PROGRESS = gql`
  mutation CreateMoroccanProgress($gameId: ID!, $data: JSON!) {
    createGameProgress(input: { gameId: $gameId, data: $data }) {
      id
      data
    }
  }
`;
const UPDATE_PROGRESS = gql`
  mutation UpdateMoroccanProgress($id: ID!, $data: JSON!) {
    updateGameProgress(input: { id: $id, data: $data }) {
      id
      data
    }
  }
`;

interface ProgressData {
  characterId: string;
  worldIndex: number;
  levelIndex: number;
  totalCoins: number;
  gamesPlayed: number;
}

export function useGameProgress() {
  const dispatch = useDispatch();
  const status = useSelector((s: RootState) => s.platform.status);
  const score = useSelector((s: RootState) => s.platform.score);
  const totalCoins = useSelector((s: RootState) => s.platform.totalCoins);
  const characterId = useSelector((s: RootState) => s.platform.characterId);
  const worldIndex = useSelector((s: RootState) => s.platform.worldIndex);
  const levelIndex = useSelector((s: RootState) => s.platform.levelIndex);
  const progressLoaded = useSelector((s: RootState) => s.platform.progressLoaded);
  const prevStatus = useRef(status);
  const prevTotalCoins = useRef(totalCoins);

  // ── Game registration ──────────────────────────────────────────────────
  const { data: gameData, refetch: refetchGame } = useQuery<{ findByGame: { id: string }[] }>(
    FIND_GAME,
    {
      variables: { filter: JSON.stringify({ uniqueName: UNIQUE_NAME }) },
      fetchPolicy: 'cache-and-network',
    },
  );
  const gameId: string | undefined = gameData?.findByGame?.[0]?.id;
  const [registerGame] = useMutation(REGISTER_GAME);

  useEffect(() => {
    if (gameData && !gameId) {
      registerGame({ variables: { uniqueName: UNIQUE_NAME } }).then(() => refetchGame());
    }
  }, [gameData, gameId, registerGame, refetchGame]);

  // ── Score ──────────────────────────────────────────────────────────────
  const { data: scoreData, refetch: refetchScore } = useQuery<{
    findByGameScore: { id: string; bestScore: number }[];
  }>(FIND_SCORE, {
    variables: { filter: JSON.stringify({ gameId }) },
    skip: !gameId,
    fetchPolicy: 'cache-and-network',
  });
  const scoreRow = scoreData?.findByGameScore?.[0];
  const [createScore] = useMutation(CREATE_SCORE);
  const [updateScore] = useMutation(UPDATE_SCORE);

  useEffect(() => {
    if (scoreRow?.bestScore != null) dispatch(setBestScore(scoreRow.bestScore));
  }, [scoreRow, dispatch]);

  // ── Progress ───────────────────────────────────────────────────────────
  const { data: progressData, refetch: refetchProgress } = useQuery<{
    findByGameProgress: { id: string; data: ProgressData }[];
  }>(FIND_PROGRESS, {
    variables: { filter: JSON.stringify({ gameId }) },
    skip: !gameId,
    fetchPolicy: 'cache-and-network',
  });
  const progressRow = progressData?.findByGameProgress?.[0];
  const [createProgress] = useMutation(CREATE_PROGRESS);
  const [updateProgress] = useMutation(UPDATE_PROGRESS);

  // Load saved progress once
  useEffect(() => {
    if (progressRow?.data && !progressLoaded) {
      const d = progressRow.data;
      dispatch(
        loadProgress({
          characterId: d.characterId,
          worldIndex: d.worldIndex ?? 0,
          levelIndex: d.levelIndex ?? 0,
          totalCoins: d.totalCoins ?? 0,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressRow]);

  function saveProgress(gamesPlayed: number) {
    if (!gameId) return;
    const data: ProgressData = { characterId, worldIndex, levelIndex, totalCoins, gamesPlayed };
    const p = progressRow?.id
      ? updateProgress({ variables: { id: progressRow.id, data } })
      : createProgress({ variables: { gameId, data } });
    p.then(() => refetchProgress());
  }

  // ── On death / game-complete: save score + progress ────────────────────
  useEffect(() => {
    const finished =
      (status === 'dead' || status === 'game-complete') && prevStatus.current === 'running';
    if (finished && gameId) {
      const best = scoreRow?.bestScore ?? 0;
      if (score > best) {
        const s = scoreRow?.id
          ? updateScore({ variables: { id: scoreRow.id, bestScore: score } })
          : createScore({ variables: { gameId, bestScore: score } });
        s.then(() => refetchScore());
      }
      const played = ((progressRow?.data?.gamesPlayed ?? 0) as number) + 1;
      saveProgress(played);
    }

    // Save when character is selected (status running ← character-select)
    if (
      status === 'running' &&
      prevStatus.current === 'character-select' &&
      gameId &&
      characterId
    ) {
      saveProgress((progressRow?.data?.gamesPlayed ?? 0) as number);
    }

    prevStatus.current = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // ── Coin SFX ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (totalCoins > prevTotalCoins.current && characterId) {
      getCharacter(characterId).playCoin();
    }
    prevTotalCoins.current = totalCoins;
  }, [totalCoins, characterId]);

  // ── Death SFX ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'dead' && prevStatus.current !== 'dead' && characterId) {
      getCharacter(characterId).playDeath();
    }
  }, [status, characterId]);
}
