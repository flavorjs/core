import { AppConfig } from './interfaces/app_config.interface.ts';
import { DeepPartial } from '../utils/types/deep_partial.type.ts';
import { EnvVariable } from './types/env_variable.type.ts';
import { Utils } from '../utils/utils.class.ts';

export class Configurator {
  private configuration: AppConfig = {
    contentSecurityPolicy: {
      allowInlineScripts: false,
      allowInlineStyles: true,
      allowedOrigins: [],
    },
    cookies: {
      maxAge: this.getEnv<number>('COOKIE_MAX_AGE') ?? 30,
    },
    cors: {
      allowCredentials: false,
      allowedHeaders: [],
      allowedMethods: ['*'],
      allowedOrigins: ['*'],
      exposedHeaders: [],
      maxAge: 0,
    },
    defaultLocale: 'en',
    encryption: {
      key: this.getEnv<string>('ENCRYPTION_KEY') ?? crypto.randomUUID(),
    },
    envFile: '.env',
    host: this.getEnv<string>('HOST') ?? 'localhost',
    isDenoDeploy: !!this.getEnv<string>('DENO_DEPLOYMENT_ID') ?? false,
    isProduction: (this.getEnv<boolean>('PRODUCTION') ?? false) ||
      (!!this.getEnv<string>('DENO_DEPLOYMENT_ID') ?? false),
    logger: true,
    port: this.getEnv<number>('PORT') ?? 5050,
    seo: {
      robots: false,
      sitemap: false,
      sitemapExcludeUrls: [],
      sitemapUrls: [],
    },
    templateDirectives: [],
    tls: {
      cert: this.getEnv<string>('TLS_CERT') ?? false,
      certFile: false,
      enabled: false,
      key: this.getEnv<string>('TLS_KEY') ?? false,
      keyFile: false,
    },
    validatorRules: [],
    webSocket: true,
  };

  private validateConfiguration(): void {
    if (this.configuration.cookies.maxAge < 0) {
      throw new Error('Cookie max age must be greater than 0');
    }

    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(this.configuration.defaultLocale)) {
      throw new Error(`App locale must follow the format 'xx' or 'xx-XX'`);
    }

    if (
      this.configuration.envFile &&
      !/^\.[a-z_\.\-]*?$/.test(this.configuration.envFile)
    ) {
      throw new Error('Invalid dotenv file name');
    }
  }

  public all(): AppConfig {
    return this.entries;
  }

  public get entries(): AppConfig {
    return this.configuration;
  }

  public get<TValue = string>(
    entry: keyof AppConfig,
    defaultValue: TValue,
  ): TValue {
    return this.configuration[entry] as TValue ??
      defaultValue;
  }

  public getEnv<TValue extends EnvVariable>(key: string): TValue | undefined {
    if (!(key in Deno.env.toObject())) {
      return undefined;
    }

    try {
      return JSON.parse(Deno.env.get(key)?.toString() ?? 'null') as
        | TValue
        | undefined;
    } catch {
      return Deno.env.get(key) as TValue;
    }
  }

  public setup(configuration: DeepPartial<AppConfig> = {}): void {
    this.configuration = Utils.deepMerge(this.configuration, configuration);

    this.validateConfiguration();
  }
}
