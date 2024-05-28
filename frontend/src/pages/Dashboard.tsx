import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
    const { data, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <Spinner />;
    if (!data) return navigate('/login');


    return (
        <div>Dashboard {data.username}</div>
    )
}
