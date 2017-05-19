import { Component, OnInit, ViewEncapsulation }    from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService }  from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  loaded: boolean = false;
  current_repos: any;
  repos: any;
  languages: Array<string>;
  people: any;
  current_language: string | boolean;
  current_section: string = 'projects';
  showSearch: boolean = false;
  search: string = '';

  lang_classes = {
    "javascript": "devicon-javascript-plain",
    "c++":        "devicon-cplusplus-plain",
    "css":        "devicon-css3-plain",
    "java":       "devicon-java-plain",
    "typescript": "devicon-typescript-plain",
    "html":       "devicon-html5-plain"
  }

  constructor(private ds: DataService, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.ds.loadGithubData().subscribe(data => {
      console.log('AppComponent', data);
      this.repos = this.current_repos = data.repos;
      this.languages = data.languages;
      this.people = data.people;
      this.loaded = true;
    });
  }

  getRepoCounter(type = 'stars', repoName) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://ghbtns.com/github-btn.html?user=vivocha&repo=${repoName}&type=${type}&count=true&size=small`);
  }

  getLanguageIconClass(repo, colored = false) {
    let c = this.lang_classes[repo.language.toLowerCase()];
    if(colored) {
      c += ' colored';
    }
    return c;
  }

  openRepo(repo) {
    window.open(repo.html_url, '_blank');
    console.log(repo);
  }

  filterByLanguage(lang = false) {
    if(!lang) {
      this.current_repos = this.repos;
    } else {
      this.current_repos = this.repos.filter((r) => r.language == lang);
    }
    this.current_language = lang;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.search = '';
    this.current_language = false;
    this.filterByLanguage();
  }
}
