import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import token from '../helpers/getToken';

function Dashboard() {
    const [btnLoading, setButtonLoading] = useState<boolean>(false);
    const { data, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <Spinner />;
    if (!data) return navigate('/login');


    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setButtonLoading(true);

        const data = new FormData(e.currentTarget);
        const username = data.get('username') as string;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // @ts-ignore
            body: JSON.stringify({ username, token: token() }),
        });

        if (!response.ok) {
            toast.error('Failed to update username');
            setButtonLoading(false);
            return;
        }

        toast.success('Username updated successfully');
        setButtonLoading(false);
    }

    return (
        <>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
                Dashboard
            </h1>

            <form className='flex gap-2 w-full' onSubmit={handleUpdate}>
                <input type="text" placeholder="Username" name='username' className='input input-sm input-bordered' defaultValue={data.username} />
                <button type='submit' className='btn btn-sm btn-neutral' disabled={btnLoading}>
                    {btnLoading && <Spinner />}
                    Update
                </button>
            </form>
        </>
    )
}

export default Dashboard;