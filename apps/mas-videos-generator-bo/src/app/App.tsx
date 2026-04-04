import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { apolloClient } from '../lib/apollo';
import { SubjectListPage } from './subjects/SubjectListPage';
import { JobListPage } from './jobs/JobListPage';
import { JobLogsPage } from './logs/JobLogsPage';
import { EnvSwitcher } from './env/EnvSwitcher';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav
        style={{
          width: 200,
          background: '#1a1a2e',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
          Videos Generator
        </span>

        {[
          { to: '/subjects', label: 'Subjects' },
          { to: '/jobs', label: 'Jobs' },
          { to: '/logs', label: 'Logs' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              color: isActive ? '#7c6af7' : '#ccc',
              textDecoration: 'none',
              padding: '0.4rem 0.6rem',
              borderRadius: 6,
              background: isActive ? 'rgba(124,106,247,0.15)' : 'transparent',
            })}
          >
            {label}
          </NavLink>
        ))}

        <div style={{ flex: 1 }} />
        <EnvSwitcher />
      </nav>
      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  );
}

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/subjects" replace />} />
            <Route path="/subjects" element={<SubjectListPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/logs" element={<JobLogsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
