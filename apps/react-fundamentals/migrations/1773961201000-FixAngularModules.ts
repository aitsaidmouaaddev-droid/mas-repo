import type { MigrationInterface, QueryRunner } from 'typeorm';

// Re-inserts any Angular modules that may have been missed in the initial seed migration.
export class FixAngularModules1773961201000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const modules = [
      { id: 'a1000000-0000-4000-8000-000000000001', label: 'Standalone Components & the Angular CLI', description: 'Bootstrapless apps with standalone: true, the new application builder (esbuild), Angular CLI essentials and project structure in Angular 19.', sortOrder: 0, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000002', label: 'Signals & Reactivity', description: 'signal(), computed(), effect(), input signals, model(), linkedSignal() and the resource() API introduced in Angular 19.', sortOrder: 1, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000003', label: 'New Template Control Flow', description: 'Built-in @if, @else, @for (with track), @switch and @defer blocks replacing *ngIf/*ngFor structural directives.', sortOrder: 2, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000004', label: 'Deferrable Views & Performance', description: '@defer, @placeholder, @loading and @error blocks for lazy rendering, plus incremental hydration strategies in Angular 19.', sortOrder: 3, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000005', label: 'Dependency Injection & inject()', description: 'inject() function, environment injectors, hierarchical DI, providedIn scopes and functional guards/interceptors.', sortOrder: 4, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000006', label: 'Routing & Lazy Loading', description: 'Standalone router, functional route guards, lazy-loaded components, withComponentInputBinding() and router state signals.', sortOrder: 5, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000007', label: 'Reactive Forms & Typed Forms', description: 'Strictly typed FormControl/FormGroup/FormArray, form builder, validators, reactive patterns and signal-based form state.', sortOrder: 6, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000008', label: 'HttpClient & Server Communication', description: 'provideHttpClient(), functional interceptors, withFetch(), typed responses and error handling with RxJS.', sortOrder: 7, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000009', label: 'Change Detection & Zoneless', description: 'OnPush strategy, markForCheck(), signal-driven updates and the experimental zoneless mode (provideExperimentalZonelessChangeDetection).', sortOrder: 8, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000010', label: 'SSR, Hydration & Angular Universal', description: 'Server-side rendering with provideClientHydration(), incremental hydration, event replay and partial hydration in Angular 19.', sortOrder: 9, category: 'Angular' },
      { id: 'a1000000-0000-4000-8000-000000000011', label: 'State Management with NgRx & Signals', description: 'NgRx SignalStore, createFeature(), ComponentStore, actions, reducers, selectors and effects with Angular 19 patterns.', sortOrder: 10, category: 'Angular' },
    ];

    for (const m of modules) {
      await queryRunner.query(
        `INSERT INTO "qcm_module" ("id", "label", "description", "sortOrder", "category")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("id") DO NOTHING`,
        [m.id, m.label, m.description, m.sortOrder, m.category]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op: the original migration handles the down
  }
}
