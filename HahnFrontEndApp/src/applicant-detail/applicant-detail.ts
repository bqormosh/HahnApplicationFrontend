import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from '../web-api';
import {ApplicantUpdated,ApplicantViewed} from '../messages';
import {Applicant} from 'Models/Applicant';
import {ValidationRules, ValidationController,ValidationControllerFactory,validateTrigger} from 'aurelia-validation';
import {BootstrapFormRenderer} from 'bootstrap-form-renderer';
import {I18N} from 'aurelia-i18n';




@inject(WebAPI, EventAggregator,ValidationControllerFactory,I18N)
export class ApplicantDetail {
  routeConfig;
  applicant: Applicant;
  controller = null;
  showSuccess:boolean = false;
  showFail:boolean = false;
  public i18n:I18N;
  constructor(private api: WebAPI, private ea: EventAggregator,private validationControllerFactory:ValidationControllerFactory,i18n:I18N) {

    this.applicant = new Applicant();
    this.controller = validationControllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.validateTrigger=validateTrigger.change;
    this.i18n = i18n;
   }

   public bind() {
      ValidationRules
      .ensure("Name").required().minLength(5).withMessage(this.i18n.tr('name_validation_msg'))
      .ensure("FamilyName").required().minLength(5).withMessage(this.i18n.tr('fname_validation_msg'))
      .ensure("Address").required().minLength(10).withMessage(this.i18n.tr('address_validation_msg'))
      .ensure("CountryOfOrigin").required().withMessage(this.i18n.tr('country_validation_msg'))
      .ensure("EmailAdress").required().email().withMessage(this.i18n.tr('email_validation_msg'))
      .ensure("Age").required().between(20,60).withMessage(this.i18n.tr('age_validation_msg'))
      .ensure("Hired").required().withMessage(this.i18n.tr('hired_validation_msg'))
      .on(this.applicant);
      console.log('validating');
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getApplicantDetails(params.id).then(applicant => {
      this.applicant = <Applicant>applicant;
      console.log(this.applicant);
      this.routeConfig.navModel.setTitle(this.applicant.Name);
      this.ea.publish(new ApplicantViewed(this.applicant));
    });
  }

  get canSave() {


    let isFilled =    this.isFilled(this.applicant.Name) && this.isFilled(this.applicant.FamilyName)&&
                      this.isFilled(this.applicant.Address) && this.isFilled(this.applicant.CountryOfOrigin)&&
                      this.isFilled(this.applicant.EmailAdress) && this.isFilled( this.applicant.Age) &&
                      this.isFilled(this.applicant.Hired);

    return isFilled ;
  }

  save() {
    this.controller.validate();
    this.api.updateApplicant(this.applicant).then(applicant => {
      if (!(applicant instanceof Error)) {
        this.applicant.ID = applicant.id;
        this.applicant.Name = applicant.name;
        this.applicant.FamilyName = applicant.familyName;
        this.applicant.Address = applicant.address;
        this.applicant.CountryOfOrigin = applicant.countryOfOrigin;
        this.applicant.EmailAdress = applicant.emailAdress;
        this.applicant.Age = applicant.age;
        this.applicant.Hired = applicant.hired;
        this.ea.publish(new ApplicantUpdated(this.applicant));
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 2000);
      }else{
        throw new Error('Unknown error encountered from the WebAPI');
      }

    }).catch(error=> {
      this.showFail = true;
      setTimeout(() => {
        this.showFail = false;
      }, 2000);
      console.log(error.message);
    });
  }


  isFilled(obj1){
    if (typeof obj1 !== 'undefined' && typeof obj1 !== 'boolean' && obj1) {
      return true;
    }else if (typeof obj1 !== 'undefined' && typeof obj1 === 'boolean' && obj1 !== null){
      return true;
    } else{
      return false;
    }
  }

}
