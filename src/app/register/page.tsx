'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AddressPicker = dynamic(() => import('../../components/AddressPicker'), { ssr: false });

const nameRegex = /^[A-Za-z\s]+$/;

const schema = z.object({
  firstName: z
    .string()
    .min(2, 'First name is too short')
    .regex(nameRegex, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(2, 'Last name is too short')
    .regex(nameRegex, 'Last name must contain only letters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Short Password'),
  phone: z
    .string()
    .regex(/^\d{10,}$/, 'Phone number must be at least 10 digits and contain only numbers'),
  address: z.string().min(5, 'Address is required'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
  console.log('Validated:', data);
  setSuccessMessage('Congrats! You have successfully Registered an Account');
  reset();
  setSelectedAddress('');
  setTimeout(() => {
    setSuccessMessage('');
  }, 3000);
};

  return (
    <div className="p-6 w-[40%] mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Registration</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('firstName')}
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

        <input
          {...register('lastName')}
          placeholder="Last Name"
          className="w-full border p-2 rounded"
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

        <input
          {...register('email')}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register('phone')}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <input
          {...register('password')}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <input
          {...register('address')}
          value={selectedAddress}
          readOnly
          className="w-full border p-2 rounded"
        />
        {errors.address && <p className="text-red-500">{errors.address.message}</p>}

        <AddressPicker
          onSelect={(address: string) => {
            setSelectedAddress(address);
            setValue('address', address);
          }}
        />

        <div className="flex flex-col items-center space-y-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Register
          </button>
          <a href="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
