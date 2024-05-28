import Spinner from "../components/Spinner";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(50),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

function Login() {
  const [btnLoading, setButtonLoading] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const { data, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Spinner />;
  if (data) return navigate("/dashboard");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonLoading(true);

    const data = new FormData(e.currentTarget);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    const parsedData = schema.safeParse({ username, password });

    if (!parsedData.success) {
      toast.error("Invalid data");
      setButtonLoading(false);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData.data),
    });

    if (!response.ok) {
      toast.error("Invalid credentials");
      setButtonLoading(false);
      return;
    }

    const { token } = await response.json();

    // Expires in 1 week
    document.cookie = `token=${token}; max-age=${60 * 60 * 24 * 7}; path=/`;

    toast.success("Logged in successfully");

    navigate("/dashboard");
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault;

    setButtonLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;

    const parsedData = resetPasswordSchema.safeParse({ email });

    if (!parsedData.success) {
      toast.error("Invalid email");
      setButtonLoading(false);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData.data),
    });

    if (!response.ok) {
      toast.error("Failed to send reset email");
      setButtonLoading(false);
      return;
    }

    toast.success("Reset email sent successfully");

    setButtonLoading(false);
  };

  return (
    <>
      {!resetPassword && (
        <>
          <h1 className="text-2xl font-bold  mb-2">Login</h1>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <input type="text" placeholder="Username" name="username" className="input input-sm input-bordered" />
            <input type="password" placeholder="Password" name="password" className="input input-sm input-bordered" />
            <button type="submit" className="btn btn-sm btn-neutral" disabled={btnLoading}>
              {btnLoading && <Spinner />}
              Login
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
          <p>
            Forgot password?{" "}
            <span onClick={() => setResetPassword(true)} className="text-blue-500 cursor-pointer">
              Reset
            </span>
          </p>
        </>
      )}

      {resetPassword && (
        <>
          <h1 className="text-2xl font-bold  mb-2">Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
          <form className="flex flex-col gap-2" onSubmit={handleResetPassword}>
            <input type="email" placeholder="Email" name="email" className="input input-sm input-bordered" />
            <button type="submit" className="btn btn-sm btn-neutral" disabled={btnLoading}>
              {btnLoading && <Spinner />}
              Send reset email
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default Login;
