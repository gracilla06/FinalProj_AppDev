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
    return <div className="p-6">Please login to view your posts and comments.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading your posts and comments...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Your Posts</h2>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="border p-4 rounded shadow">
                <div className="flex items-center space-x-3 mb-2">
                  <FaUserCircle className="text-3xl text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Posted by: {getUsernameByUserId(post.userId)}
                    </p>
                  </div>
                </div>
                <p>{post.body}</p>

                {/* Comments */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Comments</h4>
                  {comments.filter(comment => comment.postId === post.id).length === 0 ? (
                    <p>No comments for this post.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments
                        .filter(comment => comment.postId === post.id)
                        .map(comment => (
                          <div key={comment.id} className="border p-3 rounded bg-gray-50">
                            <div className="flex items-center space-x-3 mb-1">
                              <FaUserCircle className="text-2xl text-green-600" />
                              <div>
                                <h5 className="font-medium">{comment.name}</h5>
                                <p className="text-xs text-gray-500">
  Commented by: {comment.email}
</p>

                              </div>
                            </div>
                            <p>{comment.body}</p>
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
  );
}
