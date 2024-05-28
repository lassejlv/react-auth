import logout from '../helpers/logout';
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast';
import Spinner from './Spinner';

export default function Navbar() {
    const { data, loading } = useAuth();

    return (
        <nav className='flex items-center justify-between p-4'>
            <h1 className='text-xl font-bold'>React Auth</h1>
            <ul className='flex gap-5'>
                <li>
                    <a href='/'>Home</a>
                </li>

                {loading ? (
                    <li>
                        <Spinner />
                    </li>
                ) : data ? (
                    <>
                        <li>
                            <a href="#" onClick={() => {
                                logout();
                                toast.success('Logged out successfully');
                                window.location.reload();
                            }}>Logout</a>
                        </li>
                        <li>
                            <a href='/dashboard'>Dashboard</a>
                        </li>
                    </>
                ) : (
                    <li>
                        <a href='/login'>Login</a>
                    </li>
                )
                }
            </ul>
        </nav>
    )
}
