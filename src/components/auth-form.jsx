import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function Authform() {
  let [flow, setFlow] = useState("signIn");
  const { signIn } = useAuthActions();

  function handleDemoSignIn() {
    const formData = new FormData();
    formData.set("email", "bella.cai@gmail.com");
    formData.set("password", "1234!@#$");
    formData.set("flow", "signIn");
    signIn("password", formData);
  }

  return (
    <div className="flex justify-center items-center flex-1 ">
      <div className="flex flex-col items-center border-2 p-3 rounded-2xl">
        <h1>{flow === "signIn" ? "Sign In" : "Sign Up"}</h1>
        <form
          className="mb-2 flex flex-col space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            signIn("password", formData);
          }}
        >
          <div>
            <input type="text" name="email" placeholder="Email" />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <input type="hidden" name="flow" value={flow} />
          <button type="submit">
            {flow === "signIn" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div>
          {flow === "signIn" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            className="cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            Click Here
          </button>
        </div>

        <div>
          <button onClick={handleDemoSignIn}>demo</button>
        </div>
      </div>
    </div>
  );
}
