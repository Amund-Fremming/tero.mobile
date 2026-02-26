export class Result<T = void> {
  public readonly value: T;
  public readonly error: string;

  constructor(data: T, errorMessage: string) {
    this.value = data;
    this.error = errorMessage;
  }

  public isError(): boolean {
    return this.error !== "";
  }

  public isSuccess() {
    return this.error === null;
  }
}

export function ok<T = void>(value: T = null!): Result<T> {
  return new Result<T>(value, "");
}

export function err<T = void>(error: string) {
  return new Result<T>(null!, error);
}
