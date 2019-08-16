import { Observable } from 'rxjs';
import { JsonApiDatastore } from '../services/json-api-datastore.service';
import { ModelConfig } from '../interfaces/model-config.interface';
import 'reflect-metadata';
export declare class JsonApiModel {
    private _datastore;
    id: string;
    [key: string]: any;
    constructor(_datastore: JsonApiDatastore, data?: any);
    syncRelationships(data: any, included: any, level: number): void;
    save(params?: any, headers?: Headers): Observable<this>;
    readonly hasDirtyAttributes: boolean;
    rollbackAttributes(): void;
    readonly modelConfig: ModelConfig;
    private parseHasOne;
    private parseHasMany;
    private parseBelongsTo;
    private getHasManyRelationship;
    private getHasOneRelationship;
    private getBelongsToRelationship;
    private createOrPeek;
}
