import { useRef, useState } from 'react'
import {
  Ads,
  BillingSetupElement,
  ChartElement,
  EventsElement,
  PeopleElement,
  PersonElement,
  PixelSetupElement,
  Reporting,
  TableElement,
  Tracking,
  useAds,
  Websites,
  WebsitesElement,
} from '@whop/elements-react'
import type { CampaignCreatorElementOverlayHandle } from '@whop/elements/ads'
import { ComponentIndex, ElementFrame, ElementGroup, IdField } from '../components/ElementFrame'
import { whopAccountId } from '../config'
import { revealElement, useStoredId } from '../useStoredId'

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
  const [personId, setPersonId] = useStoredId('roas.tracking.person')
  const personReady = personId.trim().length > 0

  const handleDismiss = () => {
    sessionStorage.setItem('roas.ads.announcement', 'dismissed')
    setDismissed(true)
  }

  const handleElementError = (error: { message: string }) => {
    setElementError(error.message)
  }

  const handlePersonOpened = (payload: { personId: string }) => {
    setPersonId(payload.personId)
    revealElement('PersonElement')
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

      <ComponentIndex
        items={[
          { id: 'CampaignCreatorElement', name: 'CampaignCreatorElement', namespace: 'ads' },
          { id: 'ChartElement', name: 'ChartElement', namespace: 'ads' },
          { id: 'TableElement', name: 'TableElement', namespace: 'ads' },
          { id: 'BillingSetupElement', name: 'BillingSetupElement', namespace: 'ads' },
          { id: 'WebsitesElement', name: 'WebsitesElement', namespace: 'websites' },
          { id: 'PixelSetupElement', name: 'PixelSetupElement', namespace: 'websites' },
          { id: 'PeopleElement', name: 'PeopleElement', namespace: 'tracking' },
          { id: 'EventsElement', name: 'EventsElement', namespace: 'tracking' },
          { id: 'PersonElement', name: 'PersonElement', namespace: 'tracking' },
        ]}
      />

      {elementError ? <p className="banner warning">{elementError}</p> : null}

      <Ads accountId={whopAccountId} accessToken={accessToken}>
        <ElementGroup id="ads-group" title="Campaigns and reporting" namespace="ads">
          <ElementFrame
            id="CampaignCreatorElement"
            name="CampaignCreatorElement"
            namespace="ads"
            summary="Opens the campaign builder as an overlay. Editing a row in the table opens the same builder on that campaign."
          >
            <div className="frame-actions">
              <p className="hint">This element is not mounted inline. New campaign opens it over the page.</p>
              <NewCampaignButton onError={setElementError} />
            </div>
          </ElementFrame>

          <Reporting>
            <ElementFrame
              id="ChartElement"
              name="ChartElement"
              namespace="ads"
              summary="Plots spend, impressions, clicks, and conversions. It uses the same window as the table below."
            >
              <ChartElement className="embed chart" onError={handleElementError} />
            </ElementFrame>
            <ElementFrame
              id="TableElement"
              name="TableElement"
              namespace="ads"
              summary="Campaigns, ad groups, and ads. Pause, resume, duplicate, or delete from a row."
            >
              <TableElement className="embed table" onError={handleElementError} />
            </ElementFrame>
          </Reporting>

          <ElementFrame
            id="BillingSetupElement"
            name="BillingSetupElement"
            namespace="ads"
            summary="Chooses the card or balance that ad spend charges first."
          >
            <BillingSetupElement className="embed billing" onError={handleElementError} />
          </ElementFrame>
        </ElementGroup>
      </Ads>

      <Websites accountId={whopAccountId} accessToken={accessToken}>
        <ElementGroup id="websites-group" title="Sites and conversion pixel" namespace="websites">
          <ElementFrame
            id="WebsitesElement"
            name="WebsitesElement"
            namespace="websites"
            summary="Every whop.site and every domain the pixel reports, with visitors, page views, sales, and revenue."
          >
            <WebsitesElement className="embed table" onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="PixelSetupElement"
            name="PixelSetupElement"
            namespace="websites"
            summary="Installs the Whop pixel on the landing page, checkout, and thank-you page, then checks that it is live."
          >
            <PixelSetupElement
              className="embed pixel"
              accountId={whopAccountId}
              accessToken={accessToken}
              showIntro={false}
              showInviteDeveloper={false}
              onError={handleElementError}
            />
          </ElementFrame>
        </ElementGroup>
      </Websites>

      <Tracking accountId={whopAccountId} accessToken={accessToken}>
        <ElementGroup id="tracking-group" title="Audience" namespace="tracking">
          <ElementFrame
            id="PeopleElement"
            name="PeopleElement"
            namespace="tracking"
            summary="Visitors and customers the pixel has seen. A row opens that person below."
          >
            <PeopleElement className="embed table" onPersonOpened={handlePersonOpened} onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="EventsElement"
            name="EventsElement"
            namespace="tracking"
            summary="Page views, leads, purchases, and custom pixel events. A person cell opens that person below."
          >
            <EventsElement className="embed table" onPersonOpened={handlePersonOpened} onError={handleElementError} />
          </ElementFrame>
          <ElementFrame
            id="PersonElement"
            name="PersonElement"
            namespace="tracking"
            summary="One person’s record. Needs a person id. A row above fills it, or paste a prsn_ id, user id, or email."
          >
            <IdField
              id="person-id"
              label="Person id"
              placeholder="prsn_…"
              hint="A prsn_ id, a Whop user id, or an email this account has seen."
              value={personId}
              onChange={setPersonId}
            />
            {personReady ? (
              <PersonElement
                key={personId.trim()}
                className="embed table"
                identifier={personId.trim()}
                onError={handleElementError}
              />
            ) : (
              <p className="hint">Enter a person id to mount PersonElement.</p>
            )}
          </ElementFrame>
        </ElementGroup>
      </Tracking>
    </div>
  )
}
