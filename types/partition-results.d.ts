import { Result } from "./index";
export interface PartitionedResults<T, E extends Error> {
    data: T[];
    errors: AggregateError | E | null;
}
export declare function partitionResults<T, E extends Error>(results: Result<T, E>[]): PartitionedResults<T, E>;
export declare function partitionResults<T, E extends Error>(results: Promise<Result<T, E>[]>): Promise<PartitionedResults<T, E>>;
export declare function partitionResults<T, E extends Error>(results: Promise<Result<T, E>>[]): Promise<PartitionedResults<T, E>>;
