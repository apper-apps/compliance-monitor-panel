import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Policies from '@/components/pages/Policies'
import PolicyCreator from '@/components/pages/PolicyCreator'
import Widgets from '@/components/pages/Widgets'
import WidgetBuilder from '@/components/pages/WidgetBuilder'
import Clients from '@/components/pages/Clients'
import ClientDetails from '@/components/pages/ClientDetails'
import Settings from '@/components/pages/Settings'
import Support from '@/components/pages/Support'
import CookieConsentBanner from '@/components/organisms/CookieConsentBanner'
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policies/create" element={<PolicyCreator />} />
        <Route path="/policies/:id/edit" element={<PolicyCreator />} />
        <Route path="/widgets" element={<Widgets />} />
        <Route path="/widgets/builder" element={<WidgetBuilder />} />
        <Route path="/widgets/:id/edit" element={<WidgetBuilder />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/settings" element={<Settings />} />
<Route path="/support" element={<Support />} />
        <Route path="/privacy-policy" element={<Policies />} />
        <Route path="/cookie-policy" element={<Policies />} />
        <Route path="/terms-of-service" element={<Policies />} />
      </Routes>
      <CookieConsentBanner />
    </Layout>
  )
}

export default App