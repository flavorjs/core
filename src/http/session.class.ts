export class Session {
  private isLoaded = false;

  private readonly variables = new Map<string, unknown>();

  private readonly storagePath = 'storage/sessions';

  constructor(private readonly id: string | null) {}

  private async readData(): Promise<void> {
    try {
      const sessionData = JSON.parse(
        await Deno.readTextFile(`${this.storagePath}/${this.id}.json`),
      );

      for (const [key, value] of Object.entries(sessionData)) {
        this.variables.set(key, value);
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }

  private async writeDataToFile(): Promise<void> {
    try {
      await Deno.mkdir(this.storagePath, {
        recursive: true,
      });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    await Deno.writeTextFile(
      `${this.storagePath}/${this.id}.json`,
      JSON.stringify({ ...this.variables }),
    );
  }

  public async get<TValue>(key: string): Promise<TValue | null> {
    if (!this.isLoaded) {
      await this.readData();

      this.isLoaded = true;
    }

    return this.variables.get(key) as TValue ?? null;
  }

  public async set<TValue>(key: string, value: TValue): Promise<void> {
    this.variables.set(key, value);

    await this.writeDataToFile();
  }
}
