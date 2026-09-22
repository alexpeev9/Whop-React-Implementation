import {
  ActivityElement,
  BalanceElement,
  Balances,
  BrandingElement,
  CapabilitiesElement,
  Dashboard,
  KycElement,
  Payments,
  PaymentsTableElement,
  RequiredActionsElement,
  RfiElement,
  Verifications,
  Wallet,
} from '@whop/elements-react'
import { ComponentIndex, ElementFrame, ElementGroup } from '../components/ElementFrame'
import { whopAccountId } from '../config'
import { getElementToken } from '../elementToken'

type PaymentsPageProps = {
  accessToken: string
}

export const PaymentsPage = ({ accessToken }: PaymentsPageProps) => {
  return (
    <div className="page payments-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Payments</p>
          <h1>ROAS Payments</h1>
        </div>
        <p className="lede">
          This is a different environment from ROAS Ads. Identity, balances, and payment history
          for ROAS Payments are on this page.
        </p>
      </header>

      <aside className="banner" role="status">
        <div>
          <strong>Announcement.</strong> Checkout keeps the Whop wordmark, with ROAS Labs set
          behind it. Full white label is not the target. Using this to take sales instead of
          Shopify Payments is on hold until that journey is scoped.
        </div>
      </aside>

      <section className="help" aria-label="How ROAS Payments works">
        <h2>How this works</h2>
        <ul>
          <li>Onboarding stays in the portal. You submit KYC details through Whop’s flow below.</li>
          <li>Balances and the payments list are the merchant view. They are not the buyer checkout.</li>
          <li>The branding sample at the bottom is what a buyer sees: Whop’s wordmark, ROAS Labs behind it.</li>
        </ul>
      </section>

      <ComponentIndex
        items={[
          { id: 'KycElement', name: 'KycElement', namespace: 'verifications' },
          { id: 'CapabilitiesElement', name: 'CapabilitiesElement', namespace: 'verifications' },
          { id: 'RfiElement', name: 'RfiElement', namespace: 'verifications' },
          { id: 'RequiredActionsElement', name: 'RequiredActionsElement', namespace: 'dashboard' },
          { id: 'PaymentsTableElement', name: 'PaymentsTableElement', namespace: 'dashboard' },
          { id: 'BalanceElement', name: 'BalanceElement', namespace: 'wallet' },
          { id: 'ActivityElement', name: 'ActivityElement', namespace: 'wallet' },
          { id: 'BrandingElement', name: 'BrandingElement', namespace: 'payments' },
        ]}
      />

      <Verifications accountId={whopAccountId} kind="business" getToken={getElementToken}>
        <ElementGroup id="verifications-group" title="Identity" namespace="verifications">
          <ElementFrame
            id="KycElement"
            name="KycElement"
            namespace="verifications"
            summary="Collects the business identity details Whop needs for verification."
          >
            <KycElement className="embed kyc" />
          </ElementFrame>
          <ElementFrame
            id="CapabilitiesElement"
            name="CapabilitiesElement"
            namespace="verifications"
            summary="Shows whether individual and business verification are done, and which capabilities that unlocks."
          >
            <CapabilitiesElement className="embed short" />
          </ElementFrame>
          <ElementFrame
            id="RfiElement"
            name="RfiElement"
            namespace="verifications"
            summary="Lists outstanding compliance requests and the forms that answer them."
          >
            <RfiElement className="embed short" />
          </ElementFrame>
        </ElementGroup>
      </Verifications>

      <Dashboard accountId={whopAccountId} accessToken={accessToken}>
        <ElementGroup id="dashboard-group" title="Account dashboard" namespace="dashboard">
          <ElementFrame
            id="RequiredActionsElement"
            name="RequiredActionsElement"
            namespace="dashboard"
            summary="Banners for identity, deposits, tax, and anything else still outstanding on the account."
          >
            <RequiredActionsElement kind="business" className="embed short" />
          </ElementFrame>
          <ElementFrame
            id="PaymentsTableElement"
            name="PaymentsTableElement"
            namespace="dashboard"
            summary="The merchant payments list: status, search, filters, and export."
          >
            <PaymentsTableElement className="embed table" />
          </ElementFrame>
        </ElementGroup>
      </Dashboard>

      <Wallet accountId={whopAccountId} accessToken={accessToken} currency="usd">
        <ElementGroup id="wallet-group" title="Balances and ledger" namespace="wallet">
          <ElementFrame
            id="BalanceElement"
            name="BalanceElement"
            namespace="wallet"
            summary="Account balance and how it changed. The viewer picks the time window."
          >
            <Balances>
              <BalanceElement className="embed chart" />
            </Balances>
          </ElementFrame>
          <ElementFrame
            id="ActivityElement"
            name="ActivityElement"
            namespace="wallet"
            summary="Every ledger movement, newest first."
          >
            <ActivityElement className="embed table" />
          </ElementFrame>
        </ElementGroup>
      </Wallet>

      <ElementGroup id="payments-group" title="Checkout branding" namespace="payments">
        <ElementFrame
          id="BrandingElement"
          name="BrandingElement"
          namespace="payments"
          summary="The Whop wordmark a buyer sees. ROAS Labs sits behind it. The wordmark stays on every payment surface."
        >
          <div className="brand-lockup">
            <p className="brand-behind" aria-hidden="true">
              ROAS Labs
            </p>
            <Payments accountId={whopAccountId} mode="setup" currency="usd">
              <BrandingElement className="embed brand" />
            </Payments>
          </div>
        </ElementFrame>
      </ElementGroup>
    </div>
  )
}
