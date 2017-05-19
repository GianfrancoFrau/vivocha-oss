import { Injectable, EventEmitter } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  base: string = 'https://api.github.com';
  orgPath: string = '/orgs/vivocha/repos';
  membersPath: string = '/orgs/vivocha/members';
  dataLoaded: EventEmitter<Object> = new EventEmitter();
  localStorageKey: string = 'vivocha_github_data';
  cacheDurationMs: number = 1*60*60*1000; // 1 h

  constructor(private http: Http) {}

  loadGithubData(type = 'public') {
    // setTimeout is used only for be sure that the pacman loader eats some dots :-)
    setTimeout(() => {
      let cached: any = localStorage.getItem(this.localStorageKey);

      if(cached) {
        try { cached = JSON.parse(cached); } catch(e){}
        let lastSave = new Date(cached.lastSave);
        if(Date.now() < (+lastSave + this.cacheDurationMs)) {
          console.log('Using cached data');
          this.dataLoaded.emit(cached);
          return;
        }
      }

      console.log('Reading data from Github');

      let org_repos_url = `${this.base}${this.orgPath}`;
      let org_repos_people = `${this.base}${this.membersPath}`;
      let params = new URLSearchParams();
      params.set('per_page', '100');
      params.set('type', type);
      Observable.forkJoin([
        this.http.get(org_repos_url, { search: params }).map(res => res.json()),
        this.http.get(org_repos_people,{ search: params }).map(res => res.json())
      ]).subscribe((response) => {
        let repos = response[0];
        let people = response[1];
        repos = this.sortByStars(repos, true);
        let languages = this.getUsedLanguages(repos);
        let data = {
          repos: repos,
          languages: languages,
          people: people,
          lastSave: Date.now()
        }
        this.dataLoaded.emit(data);
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      });
    }, 1000);
    return this.dataLoaded;
  }

  getUsedLanguages(repos) {
    let l = [];
    repos.forEach(el => {
      if(el.language && l.indexOf(el.language) == -1) {
        l.push(el.language);
      }
    });
    // return Array.from(new Set(l));
    return l;
  }

  sortByStars(repos, invert = false) {
    return repos.sort((r1, r2) => {
      let inverter = invert ? -1 : 1;
      return (r1.stargazers_count - r2.stargazers_count) * inverter;
    })
  }

}
