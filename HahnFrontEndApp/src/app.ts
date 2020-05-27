import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import {I18N} from 'aurelia-i18n';
export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router){
    config.title = 'Applicants';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '',              moduleId: PLATFORM.moduleName('no-selection'),   title: 'Select' },
      { route: 'applicants/:id',  moduleId: PLATFORM.moduleName('./applicant-detail/applicant-detail'), name:'applicants' },
      { route: 'applicants/add',  moduleId: PLATFORM.moduleName('./applicant-new/applicant-new'), name:'AddApplicants' }
    ]);

    this.router = router;
  }
}
