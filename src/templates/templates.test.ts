import {
  assertEquals,
  assertStringIncludes,
} from 'https://deno.land/std@0.203.0/assert/mod.ts';
import { inject } from '../injector/functions/inject.function.ts';
import { TemplateCompiler } from './template_compiler.service.ts';

Deno.test('templates module', async (test) => {
  const compiler = inject(TemplateCompiler);

  await test.step('compiler properly renders @csrf directive', async () => {
    const rendered = await compiler.render('@csrf');

    assertStringIncludes(rendered, '<input type="hidden"');
  });

  await test.step('compiler properly renders @dev directive', async () => {
    const rendered = await compiler.render('@dev entropy @/dev');

    assertStringIncludes(rendered, 'entropy');
  });

  await test.step('compiler properly renders @each directive', async () => {
    const rendered = await compiler.render(
      '@each (item in [1, 2, 3]) {{ item }} @/each',
    );

    assertStringIncludes(rendered, '1');
    assertStringIncludes(rendered, '2');
    assertStringIncludes(rendered, '3');
  });

  await test.step('compiler properly renders @hotReload directive', async () => {
    const rendered = await compiler.render('@hotReload');

    assertStringIncludes(rendered, '<script');
  });

  await test.step('compiler properly renders @if directive', async () => {
    const renderedTrue = await compiler.render('@if (true) entropy @/if');
    const renderedFalse = await compiler.render('@if (false) entropy @/if');

    assertStringIncludes(renderedTrue, 'entropy');
    assertEquals(renderedFalse, '');
  });

  await test.step('compiler properly renders @json directive', async () => {
    const rendered = await compiler.render(`@json({ name: 'Bond' })`);

    assertEquals(rendered, '{"name":"Bond"}');
  });

  await test.step('compiler properly renders @method directive', async () => {
    const rendered = await compiler.render(`@method('PATCH')`);

    assertStringIncludes(rendered, '<input type="hidden"');
  });

  await test.step('compiler properly renders @nonceProp directive', async () => {
    const rendered = await compiler.render('@nonceProp');

    assertStringIncludes(rendered, 'nonce=');
  });

  await test.step('compiler properly renders @prod directive', async () => {
    const rendered = await compiler.render('@prod entropy @/prod');

    assertEquals(rendered, '');
  });

  await test.step('compiler properly renders @stack and @push directive', async () => {
    const rendered = await compiler.render(
      `
      @stack('test')

      @push('test') a @/push
      @push('test') b @/push
      `,
    );

    assertStringIncludes(rendered, 'a');
    assertStringIncludes(rendered, 'b');
  });

  await test.step('compiler properly renders @switch directive', async () => {
    const rendered = await compiler.render(
      `
      @switch (2)
        @case (1)
          1
        @/case

        @case (2)
          2
        @/case

        @case (3)
          3
        @/case
      @/switch
      `,
    );

    assertStringIncludes(rendered, '2');
  });
});
