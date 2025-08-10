'use client';

import { useState } from 'react';
import AdminPasswordEntry from './AdminPasswordEntry';

interface DashboardPasswordGateProps {
  children: React.ReactNode;
}

export default function DashboardPasswordGate({
  children,
}: DashboardPasswordGateProps) {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  if (!isPasswordVerified) {
    return (
      <AdminPasswordEntry
        onCorrectPassword={() => setIsPasswordVerified(true)}
      />
    );
  }

  return <>{children}</>;
}
