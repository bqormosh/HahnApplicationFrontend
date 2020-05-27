import { ApplicantNew } from '../applicant-new/applicant-new';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from '../web-api';
import { ApplicantUpdated, ApplicantViewed, ApplicantAdded } from '../messages';
import {inject} from 'aurelia-framework';

@inject(WebAPI, EventAggregator)
export class ApplicantList {
  applicants;
  selectedId = 0;
  constructor(private api: WebAPI, ea: EventAggregator) {
    ea.subscribe(ApplicantViewed, msg => this.select(msg.applicant));
    ea.subscribe(ApplicantUpdated, msg => {
      console.log('inside update event ******');
      console.log(msg);
      console.log(msg.applicant);
      let id = msg.applicant.id;
      let foundIndex = this.applicants.findIndex(x => x.id === id);
      console.log('index is',foundIndex);
      if (foundIndex > -1){
        this.applicants[foundIndex].ID = parseInt(msg.applicant.ID);
        this.applicants[foundIndex].Name = msg.applicant.Name;
        this.applicants[foundIndex].FamilyName = msg.applicant.FamilyName;
        this.applicants[foundIndex].Address = msg.applicant.Address;
        this.applicants[foundIndex].CountryOfOrigin = msg.applicant.CountryOfOrigin;
        this.applicants[foundIndex].EmailAdress = msg.applicant.EmailAdress;
        this.applicants[foundIndex].Age = parseInt(msg.applicant.Age);
        this.applicants[foundIndex].Hired = msg.applicant.Hired;
      }
      //Object.assign(found, msg.applicant);
    });
    ea.subscribe(ApplicantAdded, msg => {
      console.log('inside add event ******');
      console.log(msg);
      console.log(msg.applicant);
      this.applicants.push({
        ID:parseInt(msg.applicant.ID),
        Name:msg.applicant.Name,
        FamilyName:msg.applicant.FamilyName,
        Address:msg.applicant.Address,
        CountryOfOrigin:msg.applicant.CountryOfOrigin,
        EmailAdress:msg.applicant.EmailAdress,
        Age:parseInt(msg.applicant.Age),
        Hired:msg.applicant.Hired
      });
      console.log(this.applicants);
    });
  }
 
  created() {
    this.api.getApplicantList().then(applicants => this.applicants = applicants);
  }

  select(applicant) {
    this.selectedId = applicant.ID;
    return true;
  }
}




