export interface queryTypes {
  size: number;
  page: number;
  filter: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  category?: string;
}

export type UsersInvolved = {
  name: string;
  emailAddress: string;
};

export type Blog = {
  id: string;
  sequenceNumber: number;
  title: string;
  content: string;
  metaImage: string;
  usersInvolved: UsersInvolved[];
  uniqueId: string;
  tagline: string;
  createdAt: string;
  modifiedAt: number;
};
