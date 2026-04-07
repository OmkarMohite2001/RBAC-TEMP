import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private config: Record<string, any> = {};

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return this.http.get<Record<string, any>>('assets/runtime-config.json')
      .toPromise()
      .then(config => {
        if(config) {
        this.config = config;
        }
      })
      .catch(() => {
        console.error('Failed to load runtime config');
      });
  }

  get<T = any>(key: string): T {
    return this.config[key];
  }

  getAll(): Record<string, any> {
    return this.config;
  }
}