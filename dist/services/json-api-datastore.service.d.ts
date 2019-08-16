import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonApiModel } from '../models/json-api.model';
import { JsonApiQueryData } from '../models/json-api-query-data';
import { DatastoreConfig } from '../interfaces/datastore-config.interface';
import 'reflect-metadata';
export declare type ModelType<T extends JsonApiModel> = {
    new (datastore: JsonApiDatastore, data: any): T;
};
export declare class JsonApiDatastore {
    private http;
    private _headers;
    private _store;
    private getDirtyAttributes;
    private toQueryString;
    protected config: DatastoreConfig;
    constructor(http: HttpClient);
    /** @deprecated - use findAll method to take all models **/
    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: Headers, customUrl?: string): Observable<T[]>;
    findAll<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: Headers, customUrl?: string): Observable<JsonApiQueryData<T>>;
    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: Headers, customUrl?: string): Observable<T>;
    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T;
    private _getDirtyAttributes;
    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model: T, params?: any, headers?: Headers, customUrl?: string): Observable<T>;
    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: Headers, customUrl?: string): Observable<Response>;
    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T | null;
    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[];
    headers: Headers;
    private buildUrl;
    private getRelationships;
    private isValidToManyRelation;
    private buildSingleRelationshipData;
    private extractQueryData;
    private transformSerializedNamesInBodyIncludes;
    private deserializeModel;
    protected extractRecordData<T extends JsonApiModel>(res: HttpResponse<Object>, modelType: ModelType<T>, model?: T): T;
    protected handleError(error: any): Observable<any>;
    protected parseMeta(body: any, modelType: ModelType<JsonApiModel>): any;
    /** @deprecated - use buildHeaders method to build request headers **/
    protected getOptions(customHeaders?: Headers): any;
    protected buildHeaders(customHeaders?: Headers): HttpHeaders;
    private _toQueryString;
    addToStore(modelOrModels: JsonApiModel | JsonApiModel[]): void;
    private resetMetadataAttributes;
    private updateRelationships;
    private readonly datastoreConfig;
    private transformSerializedNamesToPropertyNames;
    private transformRelationshipPropertyNamesToSerializedNames;
    private getModelPropertyNames;
}
