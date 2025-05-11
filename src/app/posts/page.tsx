'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type User = {
  id: number;
  name: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const isAdmin = user.isAdmin === true;
    const userId = user.id;

    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
      fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
    ]).then(([postData, userData]) => {
      setUsers(userData);
      const filteredPosts = isAdmin
        ? postData
        : postData.filter((post: Post) => post.userId === userId);
      setPosts(filteredPosts);
      setLoading(false);
    });
  }, []);

  const getAuthorName = (userId: number) =>
    users.find(user => user.id === userId)?.name || 'Unknown Author';

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center p-6 space-x-2">
      <div className="animate-spin border-t-2 border-blue-500 border-solid w-6 h-6 rounded-full"></div>
      <p className="text-gray-600">Loading posts...</p>
    </div>
  );
  

  return (
    <div className="p-8 w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-xl space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>

      <input
        type="text"
        placeholder="Search posts..."
        className="mb-6 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredPosts.map(post => (
            <li key={post.id} className="border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition shadow-md hover:shadow-xl hover:scale-105">
              <Link href={`/posts/${post.id}`} className="block">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-2">By {getAuthorName(post.userId)}</p>
              <p className="text-gray-700 line-clamp-3">{post.body}</p>
              <button className="mt-3 text-blue-500 font-medium hover:underline">Read More</button>
              </Link>
            </li>
          ))}
        </ul>

      )}
    </div>
  );
}
