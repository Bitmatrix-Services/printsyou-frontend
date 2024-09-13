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
  createdAt: number;
  modifiedAt: number;
};
