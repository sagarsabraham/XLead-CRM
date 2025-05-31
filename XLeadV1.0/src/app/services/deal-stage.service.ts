// src/app/services/deal-stage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface DealStage {
  id: number;
  stageName: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DealStageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStages(): Observable<DealStage[]> {
    const url = `${this.apiUrl}/api/DealStage`;
    return this.http.get<DealStage[]>(url);
  }
}