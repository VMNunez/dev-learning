export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page: PageMetadata;
}

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}
