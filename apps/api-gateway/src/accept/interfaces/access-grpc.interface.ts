import type { Observable } from 'rxjs';

export interface AccessHealthResponse {
  status: boolean;
  service: string;
}

export interface AccessGrpcService {
  health(data: Record<string, never>): Observable<AccessHealthResponse>;
}
