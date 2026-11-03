export declare class HashService {
    private readonly options;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, passwordHash: string): Promise<boolean>;
    generateRefreshToken(): string;
    hashRefreshToken(token: string): string;
}
