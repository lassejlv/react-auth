import useFetch from "react-fetch-hook";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export default function ResetPassword() {
  const [btnLoading, setButtonLoading] = useState<boolean>(false);
  const tokenQuery = new URLSearchParams(useLocation().search).get("token");
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetch(`${import.meta.env.VITE_API_URL}/auth/password-reset?token=${tokenQuery}`);

  if (isLoading) return <Spinner />;
  if (error) {
    toast.error("Invalid token");
    navigate("/login");
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const newPassword = data.get("newPassword") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    const parsedData = schema.safeParse({ newPassword, confirmPassword });

    if (!parsedData.success) {
      toast.error("Invalid data");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setButtonLoading(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/password-reset`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: tokenQuery, password: newPassword }),
    });

    if (!response.ok) {
      toast.error("Failed to reset password");
      setButtonLoading(false);
      return;
    }

    toast.success("Password reset successfully");
    navigate("/login");
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleUpdatePassword}>
        <input type="password" placeholder="New Password" name="newPassword" className="input input-bordered input-sm" />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          className="input input-bordered input-sm"
        />
        <button type="submit" className="btn btn-sm btn-neutral" disabled={btnLoading}>
          {btnLoading && <Spinner />}
          Reset Password
        </button>
      </form>
    </>
  );
}
