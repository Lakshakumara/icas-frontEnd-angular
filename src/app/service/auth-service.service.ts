import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Member } from '../Model/member';
import { delay, map, tap } from 'rxjs/operators';
import { Dependant } from '../Model/dependant';
import { Claim } from '../Model/claim';
import { Utils } from '../util/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private API_URL = environment.baseUrl;


  constructor(private http: HttpClient) { }

  getMembers(
    searchFor: string,
    searchText: string,
    filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number
  ) {
    return this.http
      .get(`${this.API_URL}/member/get`, {
        params: new HttpParams()
          .set('empNo', '')
          .set('searchText', searchText)
          .set('searchFor', searchFor)
          .set('year', Utils.currentYear)
          .set('memberStatus', searchFor)
          .set('filter', filter)
          .set('sortOrder', sortDirection)
          .set('pageNumber', pageIndex.toString())
          .set('pageSize', pageSize.toString()),
      })
      .pipe<Member[]>(map((res: any) => res));
  }

  getRelationShip(rs: string): Observable<string[]> {
    return this.http
      .get(`${this.API_URL}/member/relationship/${rs}`)
      .pipe<string[]>(map((data: any) => data));
  }

  getMember(empNo: any): Observable<Member> {
    return this.http
      .get(`${this.API_URL}/member/${empNo}`)
      .pipe<Member>(map((data: any) => data));
  }

  /**
   *
   * @param criteria Member Details
   * @param data
   * @returns
   */
  update(criteria: string, data: any): Observable<number> {
    const x = this.http
      .put(`${this.API_URL}/member/update/${criteria}`, data)
      .pipe<number>(map((data: any) => data));
    return x;
  }
  // Original One
  async updateMember(criteria: string, data: any): Promise<Observable<any>> {
    return await fetch(`${this.API_URL}/member/update/${criteria}`, {
      method: 'put',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        //if it worked
        //this.secondApiCall()
        console.log('auth res ', responseJson);
        return responseJson;
      })
      .catch((error) => {
        return error;
      });
  }
  async saveOPD(claimOPD: any): Promise<Observable<any>> {
    return await fetch(`${this.API_URL}/claim/opd`, {
      method: 'POST',
      body: JSON.stringify(claimOPD),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        return error;
      });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/member/signin`, data);
  }

  register(data: any): Observable<any> {
    return this.http
      .post(`${this.API_URL}/member/signup`, data)
      .pipe<any>(map((data: any) => data));
  }

  getUser(data: any): Observable<any> {
    return this.http.get(`${this.API_URL}/member/data`, data);
  }

  /**
   *
   * @param claimType '%' for any
   * @param year
   * @param empNo '' for any
   * @param claimStatus '%' for any
   * @param filter
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   * @returns
   */
  getAllClaims(
    claimType: string = '%',
    year: number = 0,
    empNo: string = '',
    claimStatus: string = '%',
    filter: string = '',
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<Claim[]> {
    console.log('getAllClaims calls claimType= ', claimType);
    return this.http
      .get(`${this.API_URL}/claim/getAll`, {
        params: new HttpParams()
          .set('claimType', claimType)
          .set('year', year)
          .set('empNo', empNo)
          .set('claimStatus', claimStatus)
          .set('filter', filter)
          .set('sortOrder', sortDirection)
          .set('pageNumber', pageIndex.toString())
          .set('pageSize', pageSize.toString()),
      })
      .pipe<Claim[]>(map((res: any) => res));
  }
  /**
   *
   * @param claimType
   * @param year 0 for neglect year
   * @param empNo '' for neglect Members
   * @param claimStatus
   * @param filter
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   * @returns
   */

  async getClaim(claimId: number): Promise<Observable<Claim>> {
    return await fetch(`${this.API_URL}/claim/get/${claimId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson: any) => {
        /*responseJson
        .pipe(
          tap((receivedData: Claim) => console.log(receivedData)),
          map((receivedData: Claim) => {
            console.log(receivedData.claimData)
            return receivedData;
          }));*/
        console.log('auth getClaims ', responseJson);
        return responseJson;
      })
      .catch((error) => {
        return null;//new Error(error);
      });
  }

  async addClaim(claim: any): Promise<Observable<any>> {
    return await fetch(`${this.API_URL}/claim/add`, {
      method: 'post',
      body: JSON.stringify(claim), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        console.log('auth res ', responseJson);
        return responseJson;
      })
      .catch((error) => {
        return new Error(error);
      });
  }

  async updateClaim_new(claim: any) {
    const response = await fetch(`${this.API_URL}/claim/update`, {
      method: 'put',
      body: JSON.stringify(claim),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  getDashboardData(year: number, empNo: string): any {
    return this.http
      .get(`${this.API_URL}/claim/dashboard/${year}/${empNo}`)
      .pipe<Claim[]>(map((data: any) => data));
  }

  isGuest(year: any, empNo: any): Observable<Map<String, Object>> {
    return this.http
      .get(`${this.API_URL}/guest/${year}/${empNo}`)
      .pipe<Map<string, Object>>(map((data: any) => data));
  }

  getHRDetails(empNo: any): Observable<any> {
    return this.http.get(`${this.API_URL}/hr/${empNo}`);
  }

  getDependant(name: any): Observable<any> {
    return this.http
      .get(`${this.API_URL}/dependant/${name}`)
      .pipe<Dependant>(map((data: any) => data));
  }
  download(type: number, year: number, empNo: string): Observable<any> {
    console.log('download ', year, empNo);
    return this.http.get(
      `${this.API_URL}/download/application/${year}/${empNo}`,
      { responseType: 'blob' }
    );
  }

  async downloadClaim1(claimId: number): Promise<Observable<any>> {
    return await fetch(`${this.API_URL}/download/application/opd/${claimId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.blob())
      .then((response) => {
        console.log(response);
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        //let fname = response.get("file name").ToString();
        //console.log(fname);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        downloadLink.setAttribute('download', 'Application.pdf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        return true;
      })
      .catch((error) => {
        return error;
      });
  }
  async getVouchers(): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.API_URL}/claim/voucherIds`
      );
      if (response.ok) return response.json();
      else throw Error('Error getting Voucher');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }
  async downloadClaim(claimId: number) {
    try {
      const response = await fetch(
        `${this.API_URL}/download/application/opd/${claimId}`
      );
      if (response.ok) return response.blob();
      else throw Error('Error generating pdf');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }

  async downloadVoucher(voucherId: number) {
    try {
      const response = await fetch(
        `${this.API_URL}/download/voucher/${voucherId}`
      );
      if (response.ok) return response.blob();
      else throw Error('Error generating pdf');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }

  async deleteClaimData(id: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.API_URL}/claim/delete/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      if (response.ok) return response.json();
      else throw Error('Error deleting Item');
    } catch (error) {
      throw Error('Failed to communicate');
    }
  }

  async waiter(claim: any = '') {
    setTimeout(function () {
      return 100;
    }, 10000);
  }

  /*update(criteria: string, data: any): Observable<number> {
    console.log('reg Update ', data);
    const x = this.http
      .put(`${this.API_URL}/member/update/${criteria}`, data)
      .pipe<number>(map((data: any) => data));

    return x;
  }*/
  /* updateMember(criteria: string, data: any) {
    console.log('updateMember ', criteria, data);
    return this.http.post(`${this.API_URL}/member/signup`, data);
  }
  // not used 
  updateClaim(claim: any): Observable<any> {
    return this.http
      .put(`${this.API_URL}/claim/update`, claim)
      .pipe<number>(map((data: any) => data));
  }

async updateClaim_async(claim: any): Promise<Observable<any>> {
    try {
      const response = await fetch(`${this.API_URL}/claim/update`, {
        method: 'put',
        body: JSON.stringify(claim), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) return response.json();
      else throw Error('Error generating pdf');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }*/
  /*async saveOPD(claimOPD: any){
  return this.http
    .post(`${this.API_URL}/claim/opd`, claimOPD)
    .subscribe((data: any) => data);
}*/

  /* getPendingOPDClaims(
   filter: string,
   sortDirection: string,
   pageIndex: number,
   pageSize: number
 ) {
   return this.getClaims(
     'opd',
     0,
     '',
     'pending',
     filter,
     sortDirection,
     pageIndex,
     pageSize
   );
 }
 
getOPD(
   empNo: any,
   filter = '',
   sortOrder = 'asc',
   pageNumber = 0,
   pageSize = 3
 ): Observable<ClaimOPD[]> {
   return this.http
     .get(`${this.API_URL}/claim/get`, {
       params: new HttpParams()
         .set('type', 'opd')
         .set('empNo', empNo)
         .set('filter', filter)
         .set('sortOrder', sortOrder)
         .set('pageNumber', pageNumber.toString())
         .set('pageSize', pageSize.toString()),
     })
     .pipe<ClaimOPD[]>(map((res: any) => res)); //res["payload"]
 }
*/


}
