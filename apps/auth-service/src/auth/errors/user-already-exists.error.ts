export class UserAlreadyExistsError extends Error {
  constructor(message = 'อีเมลนี้ถูกใช้งานแล้ว') {
    super(message);

    this.name = 'UserAlreadyExistsError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
