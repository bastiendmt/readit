export interface Post {
  identifier: string;
  title: string;
  body?: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  // Virtual fields
  url: string;
  voteScore?: number;
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
  posts: Post[];
  bannerUrn: string;
  imageUrn: string;
  username: string;
  //Virtuals
  bannerUrl: string;
  imageUrl: string;
  postCount?: number;
}
