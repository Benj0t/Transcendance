import React from 'react';
import Settings from '../components/Settings';

const SettingsPage: React.FC = () => {
  const settings = [
    { id: '0', label: 'Username', value: 'Benjot' },
    { id: '0', label: 'Username', value: 'Benjot' },
    { id: '0', label: 'Username', value: 'Benjot' },
    { id: '0', label: 'Username', value: 'Benjot' },
    { id: '0', label: 'Username', value: 'Benjot' },
    { id: '0', label: 'Username', value: 'Benjot' },
  ];
  return <Settings settings={settings} />;
};

export default SettingsPage;
