import { HttpStatus } from './enums/http_status.enum.ts';
import { inject } from '../injector/functions/inject.function.ts';
import { Json } from './json.class.ts';
import { TemplateCompilerOptions } from '../templates/interfaces/template_compiler_options.interface.ts';
import { RedirectDestination } from '../router/types/redirect_destination.type.ts';
import { Router } from '../router/router.service.ts';
import { Utils } from '../utils/utils.class.ts';
import { View } from '../templates/view.class.ts';

export abstract class Controller {
  protected json(json: object): Json {
    return new Json(json);
  }

  protected redirect(
    destination: RedirectDestination,
    statusCode = HttpStatus.Found,
  ): Response {
    return inject(Router).createRedirect(destination, statusCode);
  }

  protected render(
    file: string,
    variables: Record<string, unknown> = {},
    options: Omit<TemplateCompilerOptions, 'file'> = {},
  ) {
    const caller = Utils.callerFile();

    file = Utils.resolveViewFile(caller, file);

    if (!file.endsWith('.html')) {
      file = `${file}.html`;
    }

    return new View(file, variables, options);
  }
}
