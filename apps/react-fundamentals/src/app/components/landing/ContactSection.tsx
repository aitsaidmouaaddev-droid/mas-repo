import { useState, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { FiMapPin, FiMail, FiPhone, FiGithub, FiPaperclip, FiX } from 'react-icons/fi';
import { useT } from '@mas/shared/i18n';
import { Container, Icon, Button } from '@mas/react-ui';
import shared from './landingShared.module.scss';
import styles from './ContactSection.module.scss';

const SEND_CONTACT = gql`
  mutation SendContactMessage($input: ContactInput!) {
    sendContactMessage(input: $input)
  }
`;

const ACCEPTED_MIME =
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp';

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.9rem',
};

interface AttachmentState {
  base64: string;
  name: string;
  type: string;
}

export default function ContactSection() {
  const { t } = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<AttachmentState | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'file-too-large'>('idle');

  const [sendContact, { loading }] = useMutation(SEND_CONTACT);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus('file-too-large');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setStatus('idle');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip "data:<mime>;base64," prefix
      const base64 = dataUrl.split(',')[1];
      setAttachment({ base64, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
  }

  function removeAttachment() {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');

    try {
      await sendContact({
        variables: {
          input: {
            name,
            email,
            message,
            ...(attachment
              ? {
                  attachmentBase64: attachment.base64,
                  attachmentName: attachment.name,
                  attachmentType: attachment.type,
                }
              : {}),
          },
        },
      });
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className={shared.sectionAlt}>
      <Container>
        <div className={shared.sectionTitle}>
          <h2 className={shared.sectionHeading}>{t('landing.contactHeading')}</h2>
          <p className={shared.sectionSubtitle}>{t('landing.contactSubtitle')}</p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiMapPin} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactLocation')}</h4>
                <p>Nangis (77370), Île-de-France</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiMail} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactEmail')}</h4>
                <p>aitsaidmouaad.dev@gmail.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiPhone} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>{t('landing.contactCall')}</h4>
                <p>07 66 29 14 17</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactItemIcon}>
                <Icon type="vector" icon={FiGithub} size={20} />
              </span>
              <div className={styles.contactItemText}>
                <h4>GitHub</h4>
                <p>
                  <a
                    href="https://github.com/aitsaidmouaaddev-droid"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    aitsaidmouaaddev-droid
                  </a>
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input
                type="text"
                placeholder={t('landing.formName')}
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
              <input
                type="email"
                placeholder={t('landing.formEmail')}
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <textarea
              rows={5}
              placeholder={t('landing.formMessage')}
              style={{ ...inputStyle, resize: 'vertical' as const }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
            />

            {/* Attachment */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_MIME}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {attachment ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: '0.85rem',
                  }}
                >
                  <Icon type="vector" icon={FiPaperclip} size={16} />
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {attachment.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      padding: 2,
                      display: 'flex',
                    }}
                    aria-label={t('landing.formRemoveFile')}
                  >
                    <Icon type="vector" icon={FiX} size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    ...inputStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    width: '100%',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <Icon type="vector" icon={FiPaperclip} size={16} />
                  <span>{t('landing.formAttachment')}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', opacity: 0.6 }}>
                    {t('landing.formAttachmentHint')}
                  </span>
                </button>
              )}
            </div>

            {status === 'success' && (
              <p style={{ color: 'var(--color-success, #22c55e)', fontSize: '0.9rem', margin: 0 }}>
                {t('landing.formSuccess')}
              </p>
            )}
            {status === 'error' && (
              <p style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.9rem', margin: 0 }}>
                {t('landing.formError')}
              </p>
            )}
            {status === 'file-too-large' && (
              <p style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.9rem', margin: 0 }}>
                {t('landing.formFileTooLarge')}
              </p>
            )}

            <Button
              variant="primary"
              type="submit"
              style={{ alignSelf: 'flex-start' }}
              disabled={loading}
            >
              {loading ? t('landing.formSending') : t('landing.formSend')}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
