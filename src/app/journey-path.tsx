import { featuredProjectMonth, getJourney } from "@/data/journey";
import { projectArt } from "@/data/project-art";
import type { ResumeModel, TimelineEntry } from "@/data/resume";

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

export default function JourneyPath({ model }: { model: ResumeModel }) {
  const { records, labels } = getJourney(model.language);
  const projects = model.timeline.filter(entry => entry.kind === "project" && !entry.placeholder);
  const featured = projects.find(entry => entry.id === "project-onemind");
  const datedIds = new Set<string>();
  const months = new Map<string, TimelineEntry[]>();
  if (featured) months.set(featuredProjectMonth, []);
  for (const record of records) {
    const project = projects.find(entry => entry.id === record.projectId);
    if (!project || project.id === featured?.id || datedIds.has(project.id)) continue;
    const month = record.date.slice(0, 7);
    months.set(month, [...(months.get(month) ?? []), project]);
    datedIds.add(project.id);
  }
  const undated = projects.filter(project => project.id !== featured?.id && !datedIds.has(project.id));

  return <section className="history" id="timeline" aria-labelledby="history-title">
    <h2 id="history-title" className="sr-only">{labels.title}</h2>
    <ol className="history-list">
      {[...months].sort(([a], [b]) => b.localeCompare(a)).map(([month, releases]) => <li className={`history-entry${month === featuredProjectMonth ? " history-entry-current" : ""}`} key={month}>
        <time className="history-date" dateTime={month}>{month.replace("-", ".")}</time>
        <div className="history-content">
          {month === featuredProjectMonth && featured && <ProductCard project={featured} model={model} featured />}
          {releases.length > 0 && <ol className={`history-grid${releases.length === 2 ? " history-grid-pair" : ""}`}>{releases.map(project => <li key={project.id}><ProductCard project={project} model={model} /></li>)}</ol>}
        </div>
      </li>)}
      {undated.length > 0 && <li className="history-entry history-entry-collection">
        <span className="history-date">{labels.other}</span>
        <div className="history-content"><ol className="history-grid">{undated.map(project => <li key={project.id}><ProductCard project={project} model={model} /></li>)}</ol></div>
      </li>}
    </ol>
  </section>;
}
