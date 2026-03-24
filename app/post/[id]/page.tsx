import PostDetailClient from "./PostDetailClient";

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  return <PostDetailClient postId={params.id} />;
}
