'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const isAdmin = user.isAdmin === true;
    const userId = user.id;

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        if (isAdmin) {
          setPosts(data); // admin sees all posts
        } else {
          setPosts(data.filter((post: Post) => post.userId === userId));
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading posts...</p>;

  return (
    <div className="p-6 w-[70%] mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="border p-4 rounded hover:bg-gray-50 transition">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 line-clamp-2">{post.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
