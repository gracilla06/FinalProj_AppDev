'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Post = { id: number; title: string; body: string; userId: number };
type Comment = { id: number; name: string; email: string; body: string };

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params?.id); // Get post ID from URL
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userJson);

    // Fetch the post
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        // Check if user is allowed to view this post
        if (!user.isAdmin && data.userId !== user.id) {
          router.push('/posts'); // not allowed
        } else {
          setPost(data);
        }
      });

    // Fetch comments
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(res => res.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId, router]);

  if (loading) return <p className="p-6">Loading post...</p>;
  if (!post) return <p className="p-6 text-red-500">Post not found or not accessible.</p>;

  return (
    <div className="p-6 w-[70%] mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">
      <Link href="/posts" className="text-blue-600 underline mb-4 inline-block">← Back to Posts</Link>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-6">{post.body}</p>

      <h2 className="text-2xl font-semibold mb-2">Comments</h2>
      <ul className="space-y-3">
        {comments.map(comment => (
          <li key={comment.id} className="border p-4 rounded">
            <p className="font-semibold">{comment.name} <span className="text-sm text-gray-500">({comment.email})</span></p>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
