import { useDispatch } from 'react-redux';
import { Typography, Button, Stack } from '@mas/react-ui';
import { useT } from '@mas/shared/i18n';
import { selectCharacter } from '../platform.slice';
import { getAllCharacters } from '../characters/character.registry';
import styles from './CharacterSelect.module.scss';

export function CharacterSelect() {
  const dispatch = useDispatch();
  const { t } = useT();
  const characters = getAllCharacters();

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <Typography variant="title" className={styles.title}>
          {t('games.moroccanRunner.chooseCharacter')}
        </Typography>
        <div className={styles.cards}>
          {characters.map((char) => (
            <div
              key={char.id}
              className={styles.card}
              style={{ '--char-color': char.color } as React.CSSProperties}
            >
              <Stack direction="vertical" gap={8} align="center">
                <div className={styles.avatar} style={{ background: char.color }} />
                <Typography variant="label">{char.name}</Typography>
                <Typography variant="caption" className={styles.flavour}>
                  {char.flavour}
                </Typography>
                <Button
                  variant="primary"
                  size="sm"
                  label={t('games.moroccanRunner.select')}
                  onClick={() => dispatch(selectCharacter(char.id))}
                />
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
