import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Invoicing } from './components/Invoicing';
import { Expenses } from './components/Expenses';
import { Simulator } from './components/Simulator';
import { CreditScore } from './components/CreditScore';
import { Onboarding } from './components/Onboarding';
import { Page, CompanyProfile } from './types';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  if (!isOnboarded) {
    return <Onboarding onComplete={(profile) => {
        setCompany(profile);
        setIsOnboarded(true);
    }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard onNavigate={setCurrentPage} />;
      case Page.INVOICES:
        return <Invoicing />;
      case Page.EXPENSES:
        return <Expenses />;
      case Page.SIMULATOR:
        return <Simulator />;
      case Page.CREDIT:
        return <CreditScore />;
      default:
        return <div className="p-10 text-center text-slate-500">Arendamisel...</div>;
    }
  };

  const handleLogout = () => {
    setIsOnboarded(false);
    setCompany(null);
    setCurrentPage(Page.DASHBOARD);
  };

  return (
    <Layout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        companyName={company?.name || 'Sinu Ettevõte'}
        onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;