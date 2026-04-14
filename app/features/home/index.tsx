import FitnessForm from "./components/form-fitness";

export function meta() {
  return [
    { title: "Healthy Me - Home Page" },
    {
      name: "description",
      content: "Demo stack: React Router, Redux Toolkit, Ant Design, Gemini.",
    },
  ];
}

export default function Home() {
  return <FitnessForm onSubmit={() => {}} />;
}
