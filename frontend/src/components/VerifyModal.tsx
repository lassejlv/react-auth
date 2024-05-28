import { useState } from "react";
import Spinner from "./Spinner";
import { z } from "zod";
import toast from "react-hot-toast";
import token from "../helpers/getToken";

const schema = z.object({
  email: z.string().email(),
});

export default function VerifyModal() {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;

    const parsedData = schema.safeParse({ email });
    if (!parsedData.success) {
      // @ts-ignore
      document.getElementById("verifyemail")?.close();
      return toast.error("Invalid email");
    }

    setButtonLoading(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token: token() }),
    });

    if (!response.ok) {
      const error = await response.json();
      // @ts-ignore
      document.getElementById("verifyemail")?.close();
      toast.error(error.error);
      setButtonLoading(false);
      return;
    }

    toast.success("Verification email sent successfully");
    setEmailSent(true);
  };

  return (
    <dialog id="verifyemail" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Verify Email</h3>

        {emailSent ? (
          <>
            <div role="alert" className="alert alert-success my-4">
              Verification email sent successfully
            </div>
          </>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input className="input input-bordered input-sm mb-2" type="email" name="email" placeholder="Email" />
            <button type="submit" className="btn btn-sm" disabled={buttonLoading}>
              {buttonLoading && <Spinner />}
              Send Verification Email
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
