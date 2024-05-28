import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import token from "../helpers/getToken";
import { SendHorizontal, ShieldAlert } from "lucide-react";
import VerifyModal from "../components/VerifyModal";

function Dashboard() {
  const [btnLoading, setButtonLoading] = useState<boolean>(false);
  const { data, loading } = useAuth();
  const navigate = useNavigate();
  const showRef = useRef<HTMLDivElement>(null);

  if (loading) return <Spinner />;
  if (!data) return navigate("/login");

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonLoading(true);

    const data = new FormData(e.currentTarget);
    const username = data.get("username") as string;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // @ts-ignore
      body: JSON.stringify({ username, token: token() }),
    });

    if (!response.ok) {
      toast.error("Failed to update username");
      setButtonLoading(false);
      return;
    }

    toast.success("Username updated successfully");
    setButtonLoading(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {!data.email_verified && (
        <>
          <div role="alert" className="alert alert-warning my-4">
            <ShieldAlert className="stroke-current shrink-0 h-6 w-6" />
            <span>Warning: No email verified</span>
            {/* @ts-ignore */}
            <button className="btn btn-sm" onClick={() => document.getElementById("verifyemail")?.showModal()}>
              <SendHorizontal size={17} /> Verify now
            </button>
          </div>

          <VerifyModal />
        </>
      )}

      <form className="flex gap-2 w-full" onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="input input-sm input-bordered"
          defaultValue={data.username}
        />
        <button type="submit" className="btn btn-sm btn-neutral" disabled={btnLoading}>
          {btnLoading && <Spinner />}
          Update
        </button>
      </form>

      {data.email_verified && (
        <div role="alert" className="alert alert-success my-4">
          <ShieldAlert className="stroke-current shrink-0 h-6 w-6" />
          <span>Email verified</span>
          <button
            className="btn btn-sm"
            onClick={() => {
              showRef.current?.classList.toggle("hidden");
            }}
          >
            Show email
          </button>
        </div>
      )}

      <p className="text-gray-500 hidden mt-4" ref={showRef}>
        Email: {data.email}
      </p>

      <footer className="mt-8">
        <p className="text-sm text-gray-500">Account created on: {new Date(data.created_at).toLocaleDateString()}</p>
      </footer>
    </>
  );
}

export default Dashboard;
