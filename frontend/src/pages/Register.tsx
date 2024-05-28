import { useState } from 'react'
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';

const schema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(50),
});

export default function Register() {
    const [btnLoading, setButtonLoading] = useState<boolean>(false);
    const { data, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <Spinner />;
    if (data) return navigate('/dashboard');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setButtonLoading(true);

        const data = new FormData(e.currentTarget);
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        const parsedData = schema.safeParse({ username, password });

        if (!parsedData.success) {
            setButtonLoading(false);
            toast.error('Invalid data');
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            setButtonLoading(false);
            toast.error('Failed to register');
            return;
        }


        toast.success('Registered successfully, please login to continue');

        navigate('/login');
    }


    return (
        <>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
                Register
            </h1>

            <form className='flex flex-col gap-5' onSubmit={handleRegister}>
                <input type="text" placeholder="Username" name='username' className='input input-sm input-bordered' />
                <input type="password" placeholder="Password" name='password' className='input input-sm input-bordered' />
                <button type='submit' className='btn btn-sm btn-neutral' disabled={btnLoading}>
                    {btnLoading && <Spinner />}
                    Register
                </button>

                <p>
                    Already have an account? <Link to='/login' className='text-blue-500'>Login</Link>
                </p>
            </form>
        </>
    )
}
