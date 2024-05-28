import Spinner from '../components/Spinner';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(50),
});

export default function Login() {
    const { data, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <Spinner />;
    if (data) return navigate('/dashboard');


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        const parsedData = schema.safeParse({ username, password });

        if (!parsedData.success) return toast.error('Invalid data');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData.data),
        })

        if (!response.ok) return toast.error('Invalid credentials');

        const { token } = await response.json();

        // Expires in 1 week
        document.cookie = `token=${token}; max-age=${60 * 60 * 24 * 7}; path=/`;

        navigate('/dashboard');
    }

    return (
        <>
            <h1 className='text-2xl font-bold text-center'>Login</h1>

            <form className='flex flex-col gap-5' onSubmit={handleLogin}>
                <input type="text" placeholder="Username" name='username' className='input input-sm input-bordered' />
                <input type="password" placeholder="Password" name='password' className='input input-sm input-bordered' />
                <button type="submit" className='btn btn-sm'>Login</button>
            </form>
        </>
    )
}
