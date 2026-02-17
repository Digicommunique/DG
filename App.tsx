
import React from 'react';
import Layout from './components/Layout.tsx';
import { Role } from './types.ts';
import CustomerDashboard from './views/CustomerDashboard.tsx';
import OperatorDashboard from './views/OperatorDashboard.tsx';
import AdminConsole from './views/AdminConsole.tsx';

const App: React.FC = () => {
  const [role, setRole] = React.useState<Role>(Role.CUSTOMER);

  const renderContent = () => {
    switch (role) {
      case Role.CUSTOMER:
        return <CustomerDashboard />;
      case Role.OPERATOR:
        return <OperatorDashboard />;
      case Role.ADMIN:
        return <AdminConsole />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <Layout activeRole={role} setRole={setRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
