import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { User } from '../types/user.type';
import { DetectFaceResponse } from '../types/response-detect-face.type';
import { RegisterNewUserResponse } from '../types/response-register-new-user.type';
import { IdentifyResponse } from '../types/response.type';
import { AddFaceResponse } from '../types/response-add-face.type';

import { ErrorService } from './error-service.service';
import { IOService } from './io-service.service';

// Using Microsoft Face API v1.0 on Azure:
// https://westeurope.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236

@Injectable()
export class ApiService {
  FACEAPI_BASE_URL = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/';
  SUBSCRIPTION_KEY = '21ab2eb966174de7a5c4e06477c898ea';
  PERSON_GROUP = '1';
  CONTENT_TYPE = {
    BINARY: 'application/octet-stream',
    JSON: 'application/json'
  };
  detectedId: string;
  recentIds: string[];

  constructor(private http: HttpClient, private errService: ErrorService, private ioService: IOService) { }

  // API CALLS
  // Detect Face
  // age,gender,headPose,smile,facialHair,glasses,emotion
  detectFace(image: Blob): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': this.CONTENT_TYPE.BINARY, 'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY })
    };
    return this.http.post(
      this.FACEAPI_BASE_URL + 'detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses&recognitionModel=recognition_02&returnRecognitionModel=false&detectionModel=detection_01',
      image,
      httpOptions);
  }

  // Identify
  identifyFace(faceData: DetectFaceResponse): Observable<Object> {
    // identify user based on the faceID from Detect Face
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': this.CONTENT_TYPE.JSON,
          'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY
        })
    };
    const body = {
      personGroupId: '1',
      faceIds: [
        faceData.faceId
      ],
      maxNumOfCandidatesReturned: 1,
      confidenceThreshold: 0.5
    };
    return this.http.post(
      this.FACEAPI_BASE_URL + 'identify',
      body,
      httpOptions);
  }

  // PersonGroup Person - Create : {name: string, userData: string} Ret: 
  registerNewUser(user: User): Observable<Object> {
    const body =
    {
      name: user.name,
      userData: user.data
    };
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': this.CONTENT_TYPE.JSON,
          'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY
        })
    };
    // http responseban a userid
    return this.http.post(
      this.FACEAPI_BASE_URL + 'persongroups/' + this.PERSON_GROUP + '/persons',
      body,
      httpOptions);
  }
  // PersonGroup Person - Add Face
  addNewFaceToUser(image: Blob, user: User): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': this.CONTENT_TYPE.BINARY, 'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY })
    };

    return this.http.post(
      this.FACEAPI_BASE_URL + 'persongroups/' + this.PERSON_GROUP + '/persons/' + user.id + '/persistedFaces?detectionModel=detection_01',
      image,
      httpOptions);
  }

  trainNewUser(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY })
    };
    // https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/1/train
    return this.http.post(
      'https://westeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/' + this.PERSON_GROUP + '/train',
      '',
      httpOptions);
  }

  // END OF API CALLS
}

