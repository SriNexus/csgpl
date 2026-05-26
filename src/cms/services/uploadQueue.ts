/**
 * uploadQueue — bounded-concurrency FIFO queue for parallel uploads.
 *
 * Prevents:
 *   • Browser stalling under 20+ concurrent uploads
 *   • Firebase Storage rate-limiting (HTTP 429)
 *
 * Also exposes pending count so the UI can surface backpressure.
 */

const DEFAULT_CONCURRENCY = 3;

type Task<T> = () => Promise<T>;

class Limiter {
  private active = 0;
  private waiting: Array<() => void> = [];
  constructor(private max: number) {}

  async run<T>(task: Task<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this.active++;
    try { return await task(); }
    finally {
      this.active--;
      const next = this.waiting.shift();
      if (next) next();
    }
  }

  pending(): number { return this.active + this.waiting.length; }
}

export const uploadQueue = new Limiter(DEFAULT_CONCURRENCY);
