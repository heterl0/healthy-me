import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "Healthy Me - Welcome Page" },
    {
      name: "description",
      content: "Demo stack: React Router, Redux Toolkit, Ant Design, Gemini.",
    },
  ];
}

export default function WelcomePage() {
  return <Welcome />;
}
