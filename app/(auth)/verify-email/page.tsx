// 
"use client";                       // MUST be first line
export const dynamic = "force-dynamic"; // Render dynamically, not statically

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // get token from URL

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      // Example: call your API to verify email
      axios.post("/api/auth/verify-email", { token })
        .then(() => setStatus("Email verified successfully!"))
        .catch(() => setStatus("Verification failed."));
    }
  }, [token]);

  return <div>{status}</div>;
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
