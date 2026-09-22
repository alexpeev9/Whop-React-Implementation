import { useRef, useState } from 'react'
import {
  Ads,
  BillingSetupElement,
  ChartElement,
  PixelSetupElement,
  Reporting,
  TableElement,
  useAds,
  Websites,
} from '@whop/elements-react'
import type { CampaignCreatorElementOverlayHandle } from '@whop/elements/ads'
import { whopAccountId } from '../config'

type AdsPageProps = {
  accessToken: string
}

const NewCampaignButton = ({ onError }: { onError: (message: string) => void }) => {
  const ads = useAds()
  const overlayRef = useRef<{
    ads: NonNullable<ReturnType<typeof useAds>>
    overlay: CampaignCreatorElementOverlayHandle
  } | null>(null)

  const handleNewCampaign = () => {
    if (!ads) return
    try {
      if (!overlayRef.current || overlayRef.current.ads !== ads) {
        overlayRef.current = { ads, overlay: ads.createOverlay('campaign-creator', {}) }
      }
      overlayRef.current.overlay.open()
    } catch (error) {
      overlayRef.current = null
      onError(error instanceof Error ? error.message : 'The campaign builder could not open.')
    }
  }

  return (
    <button
      type="button"
      className="primary"
      onClick={handleNewCampaign}
      disabled={!ads}
      aria-label="Create a campaign"
    >
      New campaign
    </button>
  )
}

export const AdsPage = ({ accessToken }: AdsPageProps) => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('roas.ads.announcement') === 'dismissed',
  )
  const [elementError, setElementError] = useState<string | null>(null)

  const handleDismiss = () => {
    sessionStorage.setItem('roas.ads.announcement', 'dismissed')
    setDismissed(true)
  }

  const handleElementError = (error: { message: string }) => {
    setElementError(error.message)
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Advertising</p>
          <h1>ROAS Ads</h1>
        </div>
        <p className="lede">
          Campaigns, reporting, billing, and the conversion pixel live on this page. These ad
          accounts are not available in your own Business Manager.
        </p>
      </header>

      {dismissed ? null : (
        <aside className="banner" role="status">
          <div>
            <strong>Announcement.</strong> All campaign management happens in ROAS Ads. Do not go
            to business.facebook.com. You will not receive Facebook Business Manager access for
            these accounts.
          </div>
          <button type="button" className="text" onClick={handleDismiss} aria-label="Dismiss announcement">
            Dismiss
          </button>
        </aside>
      )}

      <section className="help" aria-label="How ROAS Ads works">
        <h2>How this works</h2>
        <ul>
          <li>Create and edit campaigns here. Launch stays inside this portal.</li>
          <li>Reporting and ad-spend billing are on this page, in ROAS Labs colors.</li>
          <li>Install the Whop pixel on the pages your ads send people to. A launch waits until that pixel is live.</li>
        </ul>
      </section>

      {elementError ? <p className="banner warning">{elementError}</p> : null}

      <Ads accountId={whopAccountId} accessToken={accessToken}>
        <section className="block">
          <div className="block-head">
            <h2>Campaigns</h2>
            <NewCampaignButton onError={setElementError} />
          </div>
          <p className="hint">
            New campaign opens the builder. Editing a row in the table opens the same builder on
            that campaign.
          </p>
        </section>

        <section className="block">
          <h2>Reporting</h2>
          <Reporting>
            <ChartElement className="embed chart" onError={handleElementError} />
            <TableElement className="embed table" onError={handleElementError} />
          </Reporting>
        </section>

        <section className="block">
          <h2>Billing</h2>
          <p className="hint">Choose the card or balance that ad spend charges first.</p>
          <BillingSetupElement className="embed billing" onError={handleElementError} />
        </section>
      </Ads>

      <Websites accountId={whopAccountId} accessToken={accessToken}>
        <section className="block">
          <h2>Conversion pixel</h2>
          <p className="hint">
            Paste the Whop pixel on the landing page, checkout, and thank-you page. This wizard
            checks that it is installed.
          </p>
          <PixelSetupElement
            className="embed pixel"
            accountId={whopAccountId}
            accessToken={accessToken}
            showIntro={false}
            showInviteDeveloper={false}
            onError={handleElementError}
          />
        </section>
      </Websites>
    </div>
  )
}
