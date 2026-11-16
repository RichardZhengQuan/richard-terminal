import { featuredProjectMonth, getJourney, spotlightProjectIds } from "@/data/journey";
import { projectArt } from "@/data/project-art";
import type { ResumeModel, TimelineEntry } from "@/data/resume";
import type { CSSProperties, ReactNode } from "react";

type ArtworkKind = "platform" | "merchant" | "product" | "studio" | "company" | "learning";

function JourneyArtwork({ kind }: { kind: ArtworkKind }) {
  const tints: Record<ArtworkKind, string> = { platform: "126, 165, 181", merchant: "201, 166, 111", product: "158, 147, 196", studio: "195, 145, 131", company: "126, 163, 157", learning: "185, 165, 117" };
  return <svg className="journey-artwork" style={{ "--art-tint": tints[kind] } as CSSProperties} viewBox="0 0 320 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="233" cy="66" r="56" fill="rgb(var(--art-tint))" fillOpacity=".28" stroke="none" />
    {kind === "platform" && <>
      <path d="M75 111v38h170v-38M160 132v31" opacity=".35" />
      <rect x="94" y="35" width="133" height="97" rx="10" fill="currentColor" fillOpacity=".035" />
      <path d="M94 58h133M113 46h2m7 0h2m7 0h2M110 72h24v43h-24m36-43h62v14h-62m0 12h26v17h-26m38-17h24v17h-24" />
      <rect x="48" y="148" width="55" height="26" rx="7" /><rect x="132" y="162" width="56" height="18" rx="6" /><rect x="218" y="148" width="55" height="26" rx="7" />
    </>}
    {kind === "merchant" && <>
      <rect x="67" y="67" width="147" height="101" rx="9" fill="currentColor" fillOpacity=".035" />
      <path d="m57 79 14-35h139l14 35M57 79c0 18 28 18 28 0 0 18 28 18 28 0 0 18 28 18 28 0 0 18 28 18 28 0 0 18 28 18 28 0 0 18 27 18 27 0M94 44l-9 35m37-35-9 35m28-35v35m28-35 9 35m14-35 5 35" />
      <rect x="84" y="110" width="47" height="58" rx="4" /><path d="M146 111h50v29h-50z" />
      <rect x="198" y="113" width="65" height="62" rx="8" fill="rgb(var(--art-tint))" /><path d="M214 129h33m-33 13h23m-23 13h29" />
    </>}
    {kind === "product" && <>
      <rect x="57" y="40" width="172" height="118" rx="12" fill="currentColor" fillOpacity=".035" /><path d="M57 65h172M73 52h3m7 0h3m7 0h3M75 83h35v56H75m48-56h85v18h-85m0 14h53m-53 12h72" />
      <rect x="208" y="82" width="56" height="97" rx="11" fill="rgb(var(--art-tint))" /><path d="M225 94h21m-23 69h26" /><rect x="220" y="109" width="32" height="38" rx="5" />
    </>}
    {kind === "studio" && <>
      <rect x="58" y="43" width="115" height="132" rx="8" transform="rotate(-9 58 43)" fill="currentColor" fillOpacity=".035" />
      <rect x="130" y="29" width="119" height="142" rx="8" fill="rgb(var(--art-tint))" /><path d="M149 51h49m-49 12h72m-72 73h72m-72 12h45M150 115c0-54 68 17 75-36" /><circle cx="150" cy="115" r="5" /><circle cx="225" cy="79" r="5" /><path d="m150 115 14-39m61 3-18 39" opacity=".4" /><rect x="160" y="72" width="8" height="8" /><rect x="203" y="114" width="8" height="8" />
      <circle cx="82" cy="112" r="12" /><circle cx="76" cy="143" r="8" fill="rgb(var(--art-tint))" />
    </>}
    {kind === "company" && <>
      <path d="m160 35 55 31v65l-55 32-55-32V66z" fill="currentColor" fillOpacity=".035" /><path d="m105 66 55 33 55-33m-55 33v64M105 97l-36 21v37m146-58 36 21v37M160 35V18" />
      <circle cx="69" cy="163" r="11" fill="rgb(var(--art-tint))" /><circle cx="251" cy="163" r="11" fill="rgb(var(--art-tint))" /><circle cx="160" cy="18" r="6" /><path d="m132 82 28-16 28 16-28 16zM132 114l28 16 28-16" />
    </>}
    {kind === "learning" && <>
      <path d="M61 55c35-10 69-5 99 14 30-19 64-24 99-14v105c-38-7-71-1-99 16-28-17-61-23-99-16z" fill="currentColor" fillOpacity=".035" /><path d="M160 69v107M78 78c20-3 42 0 63 10m-63 8c20-3 42 0 63 10m-63 8c20-3 42 0 63 10m38-36c21-10 43-13 63-10m-63 28c21-10 43-13 63-10m-63 28c15-7 30-10 45-11" />
      <path d="M203 43V20h22v29l-11-6-11 6z" fill="rgb(var(--art-tint))" /><path d="M91 32v-9m-5 4h10M263 112h13m-6-6v12" />
    </>}
  </svg>;
}

function ProductCard({ project, model, featured = false }: { project: TimelineEntry; model: ResumeModel; featured?: boolean }) {
  const art = projectArt[project.id];
  const destination = project.url ?? project.source;
  return <article className={`${featured ? "work-feature" : "work-card"}${art?.darkArtwork ? " work-art-dark" : ""}`} aria-label={project.title}>
    {art && <img className="work-background" src={art.background} alt="" loading={featured ? "eager" : "lazy"} decoding="async" />}
    <div className="work-card-top">
      {art && <span className="work-icon">{art.icon ? <img src={art.icon} alt="" width="28" height="28" loading="lazy" decoding="async" /> : <span aria-hidden="true">{art.mark}</span>}</span>}
      {featured && <span className="work-eyebrow">{model.language === "zh" ? "核心项目" : "Featured project"}</span>}
    </div>
    <div className="work-card-copy">
      <h3 title={project.title}>{destination ? <a href={destination} target="_blank" rel="noopener noreferrer">{project.title}</a> : project.title}</h3>
      <p className="work-summary">{project.summary}</p>
      <div className="history-links">
        {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{model.labels.visitProject}</a>}
        {project.source && <a href={project.source} target="_blank" rel="noopener noreferrer">{model.labels.viewSource}</a>}
      </div>
    </div>
  </article>;
}

function TimelineChapter({ date, title, id, children, current = false }: { date: string; title: string; id: string; children: ReactNode; current?: boolean }) {
  return <li className={`history-entry history-entry-chapter${current ? " history-entry-current" : ""}`}>
    <time className="history-date" dateTime={date}>{date.replace("-", ".")}</time>
    <div className="history-chapter-heading" id={id}><h3 className="history-chapter-title" id={`${id}-title`}>{title}</h3></div>
    <div className="history-content history-chapter-content">{children}</div>
  </li>;
}

function CareerTimeline({ career }: { career: TimelineEntry }) {
  const roles = career.roles ?? [];
  if (!career.startDate) return null;
  return <TimelineChapter date={career.startDate} title={career.title} id={career.id}>
    <ol className="career-role-cards">
      {roles.map(role => <li key={role.id}>
        <article className="career-card career-card-illustrated" aria-labelledby={`${career.id}-title ${career.id}-${role.id}-title`}>
          <div className="career-copy"><h4 id={`${career.id}-${role.id}-title`}>{role.title}{role.scope && <span className="career-scope"> · {role.scope}</span>}</h4></div>
          <JourneyArtwork kind={role.id === "platform-design-expert" ? "platform" : role.id === "merchant-senior-designer" ? "merchant" : "product"} />
        </article>
      </li>)}
    </ol>
  </TimelineChapter>;
}

export default function JourneyPath({ model }: { model: ResumeModel }) {
  const { labels, earlierChapters } = getJourney(model.language);
  const projects = model.timeline.filter(entry => entry.kind === "project" && !entry.placeholder);
  const careers = model.timeline.filter(entry => entry.kind === "work" && !entry.placeholder && entry.roles?.length)
    .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));
  const featured = projects.find(entry => entry.id === "project-onemind");
  const spotlight = spotlightProjectIds.map(id => projects.find(project => project.id === id))
    .filter((project): project is TimelineEntry => project !== undefined);
  const spotlightIds = new Set(spotlight.map(project => project.id));
  const otherProjects = projects.filter(project => project.id !== featured?.id && !spotlightIds.has(project.id));

  return <section className="history" id="timeline" aria-labelledby="history-title">
    <h2 id="history-title" className="sr-only">{labels.title}</h2>
    <ol className="history-list">
      {(featured || spotlight.length > 0) && <TimelineChapter date={featuredProjectMonth} title={labels.entrepreneurship} id={`chapter-${featuredProjectMonth}`} current>
        {featured && <ProductCard project={featured} model={model} featured />}
        {spotlight.length > 0 && <ol className={`history-grid${spotlight.length === 2 ? " history-grid-pair" : ""}`}>{spotlight.map(project => <li key={project.id}><ProductCard project={project} model={model} /></li>)}</ol>}
      </TimelineChapter>}
      {otherProjects.length > 0 && <li className="history-entry history-entry-collection">
        <span className="history-date" aria-hidden="true" />
        <div className="history-content"><ol className="history-grid">{otherProjects.map(project => <li key={project.id}><ProductCard project={project} model={model} /></li>)}</ol></div>
      </li>}
      {careers.map(career => <CareerTimeline career={career} key={career.id} />)}
      {[...earlierChapters].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(chapter => <TimelineChapter date={chapter.startDate} title={chapter.heading} id={chapter.id} key={chapter.id}>
        <div className="career-role-cards">
          {chapter.cards.map(card => <article className="career-card career-card-illustrated" aria-labelledby={`${card.id}-title`} key={card.id}>
            <div className="career-copy"><h4 id={`${card.id}-title`}>{card.title}</h4></div>
            <JourneyArtwork kind={card.id === "hujiaotang-studio" ? "studio" : card.id === "qiketabi-company" ? "company" : "learning"} />
          </article>)}
        </div>
      </TimelineChapter>)}
    </ol>
  </section>;
}
