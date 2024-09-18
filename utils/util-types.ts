export type NullableField<T> = T | null | undefined;
export interface Auditable {
  createdAt: string;
  createdBy: string;
  modifiedAt: NullableField<string>;
  modifiedBy: NullableField<string>;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  offset: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
}

export interface PagedData<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  sort: Sort;
}

export interface Notification extends Sortable {
  id: string;
  backgroundColor?: string;
  notificationMessage: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: any;
}

export interface Sortable {
  sequenceNumber: number;
}
