export interface Post {
  identifier: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subName: string;
  body?: string;
  username: string;
  sub: Sub;
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

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export interface Comment {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
  post?: Post;
}
