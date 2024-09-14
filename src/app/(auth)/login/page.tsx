import type { Metadata } from "next";

// are only supported in Server Components.
export const metadata: Metadata = {
  title: "login",
  description: "this is description",
};

export default function Login() {
  return <div>login</div>;
}
