export interface Post {
  identifier: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subName: string;
  body?: string;
  username: string;
  // virtual fields
  voteScore?: number;
  url: string;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
