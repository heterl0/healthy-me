import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Healthy Me" },
    {
      name: "description",
      content: "Demo stack: React Router, Redux Toolkit, Ant Design, Gemini.",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
