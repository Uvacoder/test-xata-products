import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "products";
    readonly columns: readonly [
      {
        readonly name: "title";
        readonly type: "string";
      },
      {
        readonly name: "price";
        readonly type: "int";
      },
      {
        readonly name: "category";
        readonly type: "string";
      },
      {
        readonly name: "image";
        readonly type: "string";
      },
      {
        readonly name: "ratingRate";
        readonly type: "float";
      },
      {
        readonly name: "ratingCount";
        readonly type: "int";
      }
    ];
  }
];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type Products = InferredTypes["products"];
export type ProductsRecord = Products & XataRecord;
export type DatabaseSchema = {
  products: ProductsRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
