import type { Observable } from 'rxjs';

export interface HealthResponse {
  status: string;
  service: string;
}

export interface AuthGrpcService {
  health(data: Record<string, never>): Observable<HealthResponse>;
}
