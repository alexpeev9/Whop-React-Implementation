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

      <section className="block">
        <h2>Identity</h2>
        <Verifications accountId={whopAccountId} kind="business" getToken={getElementToken}>
          <KycElement className="embed kyc" />
          <CapabilitiesElement className="embed short" />
          <RfiElement className="embed short" />
        </Verifications>
      </section>

      <section className="block">
        <h2>Account</h2>
        <Dashboard accountId={whopAccountId} accessToken={accessToken}>
          <RequiredActionsElement kind="business" className="embed short" />
          <PaymentsTableElement className="embed table" />
        </Dashboard>
        <Wallet accountId={whopAccountId} accessToken={accessToken} currency="usd">
          <Balances>
            <BalanceElement className="embed chart" />
          </Balances>
          <ActivityElement className="embed table" />
        </Wallet>
      </section>

      <section className="block">
        <h2>Checkout branding</h2>
        <p className="hint">
          ROAS Labs sits behind Whop’s merchant-of-record wordmark. The wordmark stays on every
          payment surface.
        </p>
        <div className="brand-lockup">
          <p className="brand-behind" aria-hidden="true">
            ROAS Labs
          </p>
          <Payments accountId={whopAccountId} mode="setup" currency="usd">
            <BrandingElement className="embed brand" />
          </Payments>
        </div>
      </section>
    </div>
  )
}
