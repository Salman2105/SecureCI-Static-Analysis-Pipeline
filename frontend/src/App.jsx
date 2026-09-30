const checks = [
  { title: 'ESLint', text: 'Checks JavaScript and React for unused variables, undefined names, and common coding mistakes.' },
  { title: 'Semgrep', text: 'Uses a small set of local rules to flag direct eval calls, suspicious secret assignments, and disabled TLS verification.' },
  { title: 'GitHub Actions', text: 'Runs linting, an API test, a frontend build, and Semgrep when code is pushed or a pull request is opened.' },
  { title: 'Security checks', text: 'Configured findings fail the pipeline so they can be reviewed. These checks cover selected patterns, not every vulnerability.' },
];

export default function App() {
  return (
    <main>
      <header>
        <p className="eyebrow">INITIAL IMPLEMENTATION</p>
        <h1>SecureCI</h1>
        <p className="subtitle">Static Analysis Pipeline</p>
        <p>A small DevSecOps foundation demonstrating automated source-code checks for an Express API and a React frontend.</p>
      </header>
      <section className="checks" aria-label="Pipeline components">
        {checks.map(({ title, text }) => (
          <article key={title}><h2>{title}</h2><p>{text}</p></article>
        ))}
      </section>
      <aside>
        <h2>About this page</h2>
        <p>This is a project overview, not a live scan dashboard. Actual results appear in the terminal and GitHub Actions logs. No production deployment is configured.</p>
      </aside>
      <footer>Source code → ESLint → API test &amp; build → Semgrep → Review findings</footer>
    </main>
  );
}
