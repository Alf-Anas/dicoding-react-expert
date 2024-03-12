export interface ThreadDetailResponsesType {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: Owner;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: ThreadCommentType[];
}

interface Owner {
  id: string;
  name: string;
  avatar: string;
}

export interface ThreadCommentType {
  id: string;
  content: string;
  createdAt: string;
  owner: CommentOwner;
  upVotesBy: string[];
  downVotesBy: string[];
}

interface CommentOwner {
  id: string;
  name: string;
  avatar: string;
}
