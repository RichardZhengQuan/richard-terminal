type ProjectArt = { background: string; icon?: string; mark?: string; darkArtwork?: boolean };

// Project-owned assets; provenance and gaps are recorded alongside the files.
export const projectArt: Record<string, ProjectArt> = {
  "project-onemind": { background: "/project-card-assets/onemind-cover.webp", icon: "/project-card-assets/onemind-icon.webp" },
  "project-neo": { background: "/project-card-assets/neo-cover.webp", icon: "/project-card-assets/neo-icon.svg" },
  "project-usaige": { background: "/project-card-assets/usaige-cover.webp", icon: "/project-card-assets/usaige-icon.webp", darkArtwork: true },
  "project-clip-loop": { background: "/project-card-assets/clip-loop-cover.webp", icon: "/project-card-assets/clip-loop-icon.webp" },
  "project-clawnest": { background: "/project-card-assets/clawnest-cover.webp", mark: "CN" },
  "project-nekobar": { background: "/project-card-assets/nekobar-icon.webp", icon: "/project-card-assets/nekobar-icon.webp", darkArtwork: true },
  "project-swiftui-native-design-skill": { background: "/project-card-assets/swiftui-cover.webp", mark: "UI" },
  "project-ai-interaction-design-guidelines": { background: "/project-card-assets/guidelines-icon.svg", icon: "/project-card-assets/guidelines-icon.svg" },
  "project-tradelens": { background: "/project-card-assets/tradelens-brand.svg", icon: "/project-card-assets/tradelens-brand.svg" },
  "project-kechia": { background: "/project-card-assets/kechia-icon.webp", icon: "/project-card-assets/kechia-icon.webp", darkArtwork: true },
  "project-iris-english": { background: "/project-card-assets/iris-english-icon.svg", icon: "/project-card-assets/iris-english-icon.svg" },
  "project-a-little-theatre": { background: "/project-card-assets/personal-icon.webp", icon: "/project-card-assets/personal-icon.webp", darkArtwork: true },
};
