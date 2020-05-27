import { inject } from 'aurelia-dependency-injection';
import {HttpClient,json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class WebAPI {

  constructor(private http: HttpClient) {
    http.configure(x => {
      x.withBaseUrl('http://localhost:65303');
    });
   }

  getApplicantList(){
    
    return this.http.fetch('/api/Applicant')
        .then(response => response.json())
        .then(applicants => {
            let results = applicants.map(x =>{ return {
              ID:x.id,
              Name:x.name,
              FamilyName:x.familyName,
              Address:x.address,
              CountryOfOrigin:x.countryOfOrigin,
              EmailAdress:x.emailAdress,
              Age:x.age,
              Hired:x.hired,
            }});
            return results;
        })
        .catch(error => {
            console.log('Error retrieving Applicants.');
               return [];
        });
  }

  getApplicantDetails(ID){

      return this.http.fetch('/api/Applicant/'+ID)
      .then(response => response.json())
      .then(x => {
        return {
          ID:x.id,
          Name:x.name,
          FamilyName:x.familyName,
          Address:x.address,
          CountryOfOrigin:x.countryOfOrigin,
          EmailAdress:x.emailAdress,
          Age:x.age,
          Hired:x.hired,
          };
      }).catch(error => {
          console.log('Error retrieving Applicants.');
            return [];
      });
  }

  saveApplicant(applicant){
    applicant.Age = parseInt(applicant.Age);
    return  this.http
      .fetch('/api/Applicant/', {
        method: 'post',
        body: json(applicant)
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(response => response.json())
      .then(savedApplicant => {
        console.log('Applicant saved successfully');
        console.log(savedApplicant);
        return savedApplicant;
      })
      .catch(error => {
        console.log('Error retrieving Applicants.');
        return error;
      });
  }

  updateApplicant(applicant){
    applicant.Age = parseInt(applicant.Age);
    return  this.http
      .fetch('/api/Applicant/', {
        method: 'put',
        body: json(applicant)
      }).then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
      .then(response => response.json())
      .then(savedApplicant => {
        console.log('Applicant saved successfully');
        console.log(savedApplicant);
        return savedApplicant;
      })
      .catch(error => {
        console.log('Error retrieving Applicants.');
        return error;
      });
  }
}
