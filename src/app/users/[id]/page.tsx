'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically load LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('../../../components/LeafletMap'), { ssr: false });

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
};

export default function UserProfile() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6  mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">

      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
      <p className="text-lg">@{user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Address:</h2>
        <p>{user.address.street}, {user.address.suite}</p>
        <p>{user.address.city}, {user.address.zipcode}</p>

        {/* Leaflet Map showing the user's location */}
        <div className="w-full h-96 mt-4">
          <LeafletMap
            lat={parseFloat(user.address.geo.lat)}
            lng={parseFloat(user.address.geo.lng)}
          />
        </div>
      </div>
    </div>
  );
}
