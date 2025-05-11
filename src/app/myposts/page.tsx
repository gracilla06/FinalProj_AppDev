'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function MyPostPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [postRes, commentRes, userRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${parsedUser.id}`),
          fetch('https://jsonplaceholder.typicode.com/comments'),
          fetch('https://jsonplaceholder.typicode.com/users'),
        ]);

        const userPosts = await postRes.json();
        const allComments = await commentRes.json();
        const users = await userRes.json();

        const userPostIds = userPosts.map((post: Post) => post.id);
        const userComments = allComments.filter((comment: Comment) =>
          userPostIds.includes(comment.postId)
        );

        setPosts(userPosts);
        setComments(userComments);
        setAllUsers(users);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getUsernameByUserId = (userId: number) => {
    const foundUser = allUsers.find(user => user.id === userId);
    return foundUser ? foundUser.username : 'Unknown User';
  };

  const getUsernameByEmail = (email: string) => {
    const foundUser = allUsers.find(user => user.email === email);
    return foundUser ? foundUser.username : 'Unknown User';
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Please login to view your posts and comments.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2 py-10">
        <div className="animate-spin border-t-2 border-blue-500 border-solid w-6 h-6 rounded-full"></div>
        <p className="text-gray-600">Loading your posts and comments...</p>
      </div>
    );
  }  

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome, {user.name}!
        </h1>
  
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 italic">No posts found.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post.id} className="border-b pb-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        Posted by: {getUsernameByUserId(post.userId)}
                      </p>
                    </div>
                  </div>
  
                  <p className="text-gray-700 mb-4">{post.body}</p>
  
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Comments</h4>
                    {comments.filter((comment) => comment.postId === post.id).length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No comments for this post.</p>
                    ) : (
                      <div className="space-y-4">
                        {comments
                          .filter((comment) => comment.postId === post.id)
                          .map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-white border rounded-md p-3 shadow-sm hover:shadow-xl hover:scale-105"
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <FaUserCircle className="text-xl text-green-600" />
                                <div>
                                  <p className="font-medium text-sm">{comment.name}</p>
                                  <p className="text-xs text-gray-500">
                                    Commented by: {getUsernameByEmail(comment.email)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{comment.body}</p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  ); }
