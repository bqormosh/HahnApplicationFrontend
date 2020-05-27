import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import {I18N, Backend, TCustomAttribute} from 'aurelia-i18n';
import XHR from 'i18next-xhr-backend';
export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));

  aurelia.use.standardConfiguration().developmentLogging()
  .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => { 
    let aliases = ['t', 'i18n'];
    // add aliases for 't' attribute
    TCustomAttribute.configureAliases(aliases);
    // register backend plugin
    instance.i18next.use(XHR);
    return instance.setup({
      backend: {                                  // <-- configure backend settings
        loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
      },
      attributes: aliases,
      lng : 'de',
      fallbackLng : 'en',
      debug : false
    });
  });
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
