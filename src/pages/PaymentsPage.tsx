import { useState } from 'react'
import {
  ActionsElement,
  ActivityDetailElement,
  ActivityElement,
  AddressElement,
  BalanceElement,
  BalanceReportElement,
  Balances,
  BreakdownElement,
  BrandingElement,
  CapabilitiesElement,
  CardCvcElement,
  CardDetailsElement,
  CardElement,
  CardExpiryElement,
  CardFields,
  CardNumberElement,
  Cards,
  CardsChartElement,
  CardsElement,
  CardsTableElement,
  CardTransactionsElement,
  Checkout,
  CheckoutElement,
  ConvertElement,
  Dashboard,
  DepositElement,
  EmailElement,
  ExpressCheckoutElement,
  KycElement,
  ListElement,
  PaymentDetailElement,
  PaymentElement,
  Payments,
  PaymentsTableElement,
  ReportActivityElement,
  Reports,
  RequiredActionsElement,
  RfiElement,
  SendElement,
  SettlementElement,
  TaxIdElement,
  VerificationElement,
  Verifications,
  Wallet,
  WhopCardElement,
  WithdrawElement,
} from '@whop/elements-react'
import type { LedgerActivity } from '@whop/elements-react'
import { ComponentIndex, ElementFrame, ElementGroup, IdField } from '../components/ElementFrame'
import { whopAccountId } from '../config'
import { getElementToken } from '../elementToken'
import { revealElement, useStoredId } from '../useStoredId'

type PaymentsPageProps = {
  accessToken: string
}

const checkoutReturnUrl = `${window.location.origin}/payments`

export const PaymentsPage = ({ accessToken }: PaymentsPageProps) => {
  const [elementError, setElementError] = useState<string | null>(null)
  const [planId, setPlanId] = useStoredId('roas.checkout.plan')
  const [paymentId, setPaymentId] = useStoredId('roas.dashboard.payment')
  const [activityId, setActivityId] = useStoredId('roas.wallet.activity')
  const [cardTransactionId, setCardTransactionId] = useStoredId('roas.wallet.cardTransaction')
  const [cardId, setCardId] = useStoredId('roas.wallet.card')
  const [activity, setActivity] = useState<LedgerActivity | null>(null)

  const planReady = planId.trim().startsWith('plan_')
  const paymentReady = paymentId.trim().startsWith('pay_')
  const cardReady = cardId.trim().startsWith('icrd_')
  const trimmedActivityId = activityId.trim()
  const trimmedCardTransactionId = cardTransactionId.trim()
  const activityReady = activity !== null || trimmedActivityId.length > 0 || trimmedCardTransactionId.length > 0

  const handleElementError = (error: { message: string }) => {
    setElementError(error.message)
  }

  const handlePaymentSelected = (payload: { paymentId: string }) => {
    setPaymentId(payload.paymentId)
    revealElement('PaymentDetailElement')
  }

  const handleActivitySelected = (payload: { activity: LedgerActivity }) => {
    setActivity(payload.activity)
    setActivityId(payload.activity.id)
    setCardTransactionId('')
    revealElement('ActivityDetailElement')
  }

  const handleActivityIdChange = (value: string) => {
    setActivity(null)
    setActivityId(value)
  }

  const handleCardTransactionIdChange = (value: string) => {
    setActivity(null)
    setCardTransactionId(value)
  }

  const handleCardSelected = (payload: { cardId: string }) => {
    setCardId(payload.cardId)
    revealElement('WhopCardElement')
  }

  const handleTransactionSelected = (payload: { transactionId: string }) => {
    setActivity(null)
    setActivityId('')
    setCardTransactionId(payload.transactionId)
    revealElement('ActivityDetailElement')
  }

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
          <li>A payment row, ledger row, or card row fills the detail below it. You can also paste the id.</li>
        </ul>
      </section>

      {elementError ? <p className="banner warning">{elementError}</p> : null}

      <ComponentIndex
        items={[
          { id: 'KycElement', name: 'KycElement', namespace: 'verifications' },
          { id: 'CapabilitiesElement', name: 'CapabilitiesElement', namespace: 'verifications' },
          { id: 'RfiElement', name: 'RfiElement', namespace: 'verifications' },
          { id: 'RequiredActionsElement', name: 'RequiredActionsElement', namespace: 'dashboard' },
          { id: 'VerificationElement', name: 'VerificationElement', namespace: 'dashboard' },
          { id: 'PaymentsTableElement', name: 'PaymentsTableElement', namespace: 'dashboard' },
          { id: 'PaymentDetailElement', name: 'PaymentDetailElement', namespace: 'dashboard' },
          { id: 'BalanceElement', name: 'BalanceElement', namespace: 'wallet' },
          { id: 'BreakdownElement', name: 'BreakdownElement', namespace: 'wallet' },
          { id: 'SettlementElement', name: 'SettlementElement', namespace: 'wallet' },
          { id: 'ListElement', name: 'ListElement', namespace: 'wallet' },
          { id: 'ActivityElement', name: 'ActivityElement', namespace: 'wallet' },
          { id: 'ActivityDetailElement', name: 'ActivityDetailElement', namespace: 'wallet' },
          { id: 'ActionsElement', name: 'ActionsElement', namespace: 'wallet' },
          { id: 'DepositElement', name: 'DepositElement', namespace: 'wallet' },
          { id: 'ConvertElement', name: 'ConvertElement', namespace: 'wallet' },
          { id: 'WithdrawElement', name: 'WithdrawElement', namespace: 'wallet' },
          { id: 'SendElement', name: 'SendElement', namespace: 'wallet' },
          { id: 'BalanceReportElement', name: 'BalanceReportElement', namespace: 'wallet' },
          { id: 'ReportActivityElement', name: 'ReportActivityElement', namespace: 'wallet' },
          { id: 'CardsElement', name: 'CardsElement', namespace: 'wallet' },
          { id: 'CardsTableElement', name: 'CardsTableElement', namespace: 'wallet' },
          { id: 'CardsChartElement', name: 'CardsChartElement', namespace: 'wallet' },
          { id: 'CardTransactionsElement', name: 'CardTransactionsElement', namespace: 'wallet' },
          { id: 'WhopCardElement', name: 'WhopCardElement', namespace: 'wallet' },
          { id: 'CardDetailsElement', name: 'CardDetailsElement', namespace: 'wallet' },
          { id: 'BrandingElement', name: 'BrandingElement', namespace: 'payments' },
          { id: 'PaymentElement', name: 'PaymentElement', namespace: 'payments' },
          { id: 'AddressElement', name: 'AddressElement', namespace: 'payments' },
          { id: 'EmailElement', name: 'EmailElement', namespace: 'payments' },
          { id: 'TaxIdElement', name: 'TaxIdElement', namespace: 'payments' },
          { id: 'CardElement', name: 'CardElement', namespace: 'payments' },
          { id: 'CardNumberElement', name: 'CardNumberElement', namespace: 'payments' },
          { id: 'CardExpiryElement', name: 'CardExpiryElement', namespace: 'payments' },
          { id: 'CardCvcElement', name: 'CardCvcElement', namespace: 'payments' },
          { id: 'CheckoutElement', name: 'CheckoutElement', namespace: 'checkout' },
          { id: 'ExpressCheckoutElement', name: 'ExpressCheckoutElement', namespace: 'checkout' },
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
            id="VerificationElement"
            name="VerificationElement"
            namespace="dashboard"
            summary="Asks the account holder to verify while verification is still outstanding. A verified account renders nothing."
          >
            <VerificationElement kind="business" className="embed short" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="PaymentsTableElement"
            name="PaymentsTableElement"
            namespace="dashboard"
            summary="The merchant payments list: status, search, filters, and export. A row opens that payment below."
          >
            <PaymentsTableElement
              className="embed table"
              onPaymentSelected={handlePaymentSelected}
              onError={handleElementError}
            />
          </ElementFrame>
          <ElementFrame
            id="PaymentDetailElement"
            name="PaymentDetailElement"
            namespace="dashboard"
            summary="One payment’s breakdown, activity, customer, and journey. Needs a pay_ id."
          >
            <IdField
              id="payment-id"
              label="Payment id"
              placeholder="pay_…"
              hint="Paste a pay_ id, or choose a row in the payments list."
              value={paymentId}
              onChange={setPaymentId}
            />
            {paymentReady ? (
              <PaymentDetailElement
                key={paymentId.trim()}
                className="embed table"
                paymentId={paymentId.trim()}
                onError={handleElementError}
              />
            ) : (
              <p className="hint">Enter a pay_ id to mount PaymentDetailElement.</p>
            )}
          </ElementFrame>
        </ElementGroup>
      </Dashboard>

      <Wallet accountId={whopAccountId} accessToken={accessToken} currency="usd">
        <ElementGroup id="wallet-group" title="Balances and ledger" namespace="wallet">
          <Balances>
            <ElementFrame
              id="BalanceElement"
              name="BalanceElement"
              namespace="wallet"
              summary="Account balance and how it changed. The viewer picks the time window."
            >
              <BalanceElement className="embed chart" />
            </ElementFrame>
            <ElementFrame
              id="BreakdownElement"
              name="BreakdownElement"
              namespace="wallet"
              summary="Splits one currency into available, pending, reserve, and negative amounts."
            >
              <BreakdownElement className="embed short" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="SettlementElement"
              name="SettlementElement"
              namespace="wallet"
              summary="Available funds, pending settlement dates, reserve terms, and any negative balance."
            >
              <SettlementElement className="embed short" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="ListElement"
              name="ListElement"
              namespace="wallet"
              summary="Every currency and token in the balance, valued in dollars, largest first."
            >
              <ListElement className="embed short" onError={handleElementError} />
            </ElementFrame>
          </Balances>
          <ElementFrame
            id="ActivityElement"
            name="ActivityElement"
            namespace="wallet"
            summary="Every ledger movement, newest first. A row opens that movement below."
          >
            <ActivityElement className="embed table" onActivitySelected={handleActivitySelected} onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="ActivityDetailElement"
            name="ActivityDetailElement"
            namespace="wallet"
            summary="One ledger movement, or a card receipt. Needs an activity id or a citx_ card transaction id."
          >
            <IdField
              id="activity-id"
              label="Activity id"
              placeholder="Activity id"
              hint="Filled when you choose a ledger row. A card transaction id takes the other field."
              value={activityId}
              onChange={handleActivityIdChange}
            />
            <IdField
              id="card-transaction-id"
              label="Card transaction id"
              placeholder="citx_…"
              hint="Paste a citx_ id, or choose a row in the card transactions table."
              value={cardTransactionId}
              onChange={handleCardTransactionIdChange}
            />
            {activityReady ? (
              <ActivityDetailElement
                key={activity?.id ?? `${trimmedActivityId}:${trimmedCardTransactionId}`}
                className="embed table"
                activity={activity}
                activityId={activity ? null : trimmedActivityId || null}
                cardTransactionId={activity ? null : trimmedCardTransactionId || null}
                onError={handleElementError}
              />
            ) : (
              <p className="hint">Choose a ledger row or enter an activity id or citx_ id to mount ActivityDetailElement.</p>
            )}
          </ElementFrame>
        </ElementGroup>

        <ElementGroup id="wallet-actions-group" title="Move money" namespace="wallet">
          <ElementFrame
            id="ActionsElement"
            name="ActionsElement"
            namespace="wallet"
            summary="Deposit, accept, send, withdraw, and convert. Each control opens its wallet flow."
          >
            <ActionsElement className="embed short" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="DepositElement"
            name="DepositElement"
            namespace="wallet"
            summary="Amount and the account’s live funding rails: crypto addresses and bank transfer fields."
          >
            <DepositElement className="embed table" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="ConvertElement"
            name="ConvertElement"
            namespace="wallet"
            summary="Swaps the USD balance to Gold or Coinbase Wrapped Bitcoin, and back."
          >
            <ConvertElement className="embed" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="WithdrawElement"
            name="WithdrawElement"
            namespace="wallet"
            summary="Payout amount, saved payout method, and standard or instant delivery."
          >
            <WithdrawElement className="embed table" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="SendElement"
            name="SendElement"
            namespace="wallet"
            summary="Sends money to a user, another account, or a public claim link."
          >
            <SendElement className="embed table" onError={handleElementError} />
          </ElementFrame>
        </ElementGroup>

        <Reports>
          <ElementGroup id="wallet-reports-group" title="Reports" namespace="wallet">
            <ElementFrame
              id="BalanceReportElement"
              name="BalanceReportElement"
              namespace="wallet"
              summary="Balance history with starting and ending balances, and money in and money out."
            >
              <BalanceReportElement className="embed table" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="ReportActivityElement"
              name="ReportActivityElement"
              namespace="wallet"
              summary="Financial activity with date, currency, direction, and movement filters, plus CSV export."
            >
              <ReportActivityElement className="embed table" onError={handleElementError} />
            </ElementFrame>
          </ElementGroup>
        </Reports>

        <ElementGroup id="wallet-cards-group" title="Cards" namespace="wallet">
          <Cards>
            <ElementFrame
              id="CardsElement"
              name="CardsElement"
              namespace="wallet"
              summary="Active issued cards, most recently issued first. A card opens it below."
            >
              <CardsElement className="embed short" onCardSelected={handleCardSelected} onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="CardsTableElement"
              name="CardsTableElement"
              namespace="wallet"
              summary="Every issued card, with cardholder, last month’s spend, limit, and creation date."
            >
              <CardsTableElement className="embed table" onCardSelected={handleCardSelected} onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="CardsChartElement"
              name="CardsChartElement"
              namespace="wallet"
              summary="Card spend over time. The period picker changes the chart."
            >
              <CardsChartElement className="embed chart" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="CardTransactionsElement"
              name="CardTransactionsElement"
              namespace="wallet"
              summary="Card transactions with status, card, and cardholder filters. A row opens that receipt in activity detail."
            >
              <CardTransactionsElement
                className="embed table"
                onTransactionSelected={handleTransactionSelected}
                onError={handleElementError}
              />
            </ElementFrame>
            <ElementFrame
              id="WhopCardElement"
              name="WhopCardElement"
              namespace="wallet"
              summary="One issued card, masked until the viewer reveals it. Needs an icrd_ id."
            >
              <IdField
                id="card-id"
                label="Card id"
                placeholder="icrd_…"
                hint="Paste an icrd_ id, or choose a card above. The same id opens card details."
                value={cardId}
                onChange={setCardId}
              />
              {cardReady ? (
                <WhopCardElement
                  key={cardId.trim()}
                  className="embed short"
                  cardId={cardId.trim()}
                  onError={handleElementError}
                />
              ) : (
                <p className="hint">Enter an icrd_ id to mount WhopCardElement.</p>
              )}
            </ElementFrame>
          </Cards>
          <ElementFrame
            id="CardDetailsElement"
            name="CardDetailsElement"
            namespace="wallet"
            summary="The card, spend against its limit, and its latest transactions. Uses the icrd_ id above."
          >
            {cardReady ? (
              <CardDetailsElement
                key={cardId.trim()}
                className="embed table"
                cardId={cardId.trim()}
                onError={handleElementError}
              />
            ) : (
              <p className="hint">Enter an icrd_ id on WhopCardElement to mount CardDetailsElement.</p>
            )}
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

      <Payments accountId={whopAccountId} mode="setup" currency="usd">
        <ElementGroup id="payment-methods-group" title="Payment methods" namespace="payments">
          <ElementFrame
            id="PaymentElement"
            name="PaymentElement"
            namespace="payments"
            summary="Payment methods and the fields the selected method requires. Setup mode saves a method and charges nothing."
          >
            <PaymentElement className="embed" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="AddressElement"
            name="AddressElement"
            namespace="payments"
            summary="Billing address. Fields and validation follow the selected country."
          >
            <AddressElement className="embed" mode="billing" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="EmailElement"
            name="EmailElement"
            namespace="payments"
            summary="Buyer email. A matching Whop account can sign in; everyone else continues as a guest."
          >
            <EmailElement className="embed field" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="TaxIdElement"
            name="TaxIdElement"
            namespace="payments"
            summary="Business tax registration, labeled with the buyer-facing name for the selected format."
          >
            <TaxIdElement className="embed field" onError={handleElementError} />
          </ElementFrame>
        </ElementGroup>
      </Payments>

      <Payments accountId={whopAccountId} mode="setup" currency="usd">
        <ElementGroup id="card-group" title="Card" namespace="payments">
          <ElementFrame
            id="CardElement"
            name="CardElement"
            namespace="payments"
            summary="Card number, expiration, and security code in one block. The number stays in a hosted field."
          >
            <CardElement className="embed field" onError={handleElementError} />
          </ElementFrame>
        </ElementGroup>
      </Payments>

      <Payments accountId={whopAccountId} mode="setup" currency="usd">
        <CardFields>
          <ElementGroup id="card-fields-group" title="Card fields" namespace="payments">
            <ElementFrame
              id="CardNumberElement"
              name="CardNumberElement"
              namespace="payments"
              summary="Hosted card number field. The number never reaches this page."
            >
              <CardNumberElement className="embed field" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="CardExpiryElement"
              name="CardExpiryElement"
              namespace="payments"
              summary="Hosted card expiration field."
            >
              <CardExpiryElement className="embed field" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="CardCvcElement"
              name="CardCvcElement"
              namespace="payments"
              summary="Hosted card security code field."
            >
              <CardCvcElement className="embed field" onError={handleElementError} />
            </ElementFrame>
          </ElementGroup>
        </CardFields>
      </Payments>

      <ElementGroup id="checkout-group" title="Checkout" namespace="checkout">
        <IdField
          id="plan-id"
          label="Plan id"
          placeholder="plan_…"
          hint="Checkout and express checkout each need their own session, so both mount from this plan_ id."
          value={planId}
          onChange={setPlanId}
        />
        <ElementFrame
          id="CheckoutElement"
          name="CheckoutElement"
          namespace="checkout"
          summary="Order summary, promo code, buyer details, and the pay button for one plan."
        >
          {planReady ? (
            <Checkout key={planId.trim()} plan={planId.trim()} returnUrl={checkoutReturnUrl}>
              <CheckoutElement className="embed checkout" onError={handleElementError} />
            </Checkout>
          ) : (
            <p className="hint">Enter a plan_ id to mount CheckoutElement.</p>
          )}
        </ElementFrame>
        <ElementFrame
          id="ExpressCheckoutElement"
          name="ExpressCheckoutElement"
          namespace="checkout"
          summary="Apple Pay and Google Pay for the same plan. Wallets render only when this domain can take them."
        >
          {planReady ? (
            <Checkout key={`express-${planId.trim()}`} plan={planId.trim()} returnUrl={checkoutReturnUrl}>
              <ExpressCheckoutElement className="embed express" onError={handleElementError} />
            </Checkout>
          ) : (
            <p className="hint">Enter a plan_ id to mount ExpressCheckoutElement.</p>
          )}
        </ElementFrame>
      </ElementGroup>
    </div>
  )
}
