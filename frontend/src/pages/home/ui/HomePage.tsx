import { Button } from '@shared/ui/button';

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="surface-card">
        <p className="eyebrow">Fungi Rewrite</p>
        <h1 className="headline">Новая архитектура готова</h1>
        <p className="body-text">
          Начинаем перенос страниц по компонентам: сначала shared/ui и feature-слои, затем страницы.
        </p>
        <div className="actions-row">
          <Button>Primary Action</Button>
          <Button variant="ghost">Secondary Action</Button>
        </div>
      </section>
    </main>
  );
}
