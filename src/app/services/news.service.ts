import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getNews(qtd: number = 10, page: number = 1) {
    return this.http.get(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}`
    );
  }
  
  searchNews(qtd: number = 10, page: number = 1, query: string) {
    return this.http.get(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}&busca=${query}`
    );
  }
}
