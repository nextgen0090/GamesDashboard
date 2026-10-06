import { ANNOUNCEMENT } from '../data/portalContent'

function AnnouncementCopy() {
  return (
    <>
      <span className="text-[#e84a9a]">Announcement · </span>
      {ANNOUNCEMENT}
    </>
  )
}

export function PortalAnnouncement() {
  return (
    <div id="section-home" className="portal-announcement-wrap">
      <div className="portal-announcement glass-panel overflow-hidden py-2">
        <div className="portal-announcement-marquee" aria-live="polite">
          <div className="portal-announcement-track">
            <p className="portal-announcement-item">
              <AnnouncementCopy />
            </p>
            <p className="portal-announcement-item" aria-hidden="true">
              <AnnouncementCopy />
            </p>
          </div>
        </div>
        <p className="portal-announcement-static px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400 sm:text-[11px]">
          <AnnouncementCopy />
        </p>
      </div>
    </div>
  )
}
