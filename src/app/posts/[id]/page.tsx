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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userJson);

    const fetchData = async () => {
      try {
        // Fetch post data
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        if (!postResponse.ok) throw new Error('Failed to fetch post');

        const postData = await postResponse.json();

        // Check if user is allowed to view this post
        if (!user.isAdmin && postData.userId !== user.id) {
          router.push('/posts'); // Not allowed to view this post
          return;
        }

        setPost(postData);

        // Fetch comments
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');

        const commentsData = await commentsResponse.json();
        setComments(commentsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, router]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading post...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!post) return <p className="p-6 text-center text-red-500">Post not found or not accessible.</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-md rounded-lg shadow-xl space-y-6">
      <Link href="/posts" className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold text-lg">
        ← Back to Posts
      </Link>

      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-6">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg">{post.body}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map(comment => (
              <li key={comment.id} className="text-xl border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition shadow-md hover:shadow-xl hover:scale-105">
                <p className="font-semibold text-gray-800">
                  {comment.name} <span className="text-sm text-gray-500">({comment.email})</span>
                </p>
                <p className="text-gray-700 mt-2">{comment.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No comments available.</p>
        )}
      </div>
    </div>
  );
}
