import FitnessForm from "./components/form-fitness";
import styles from "./styles.module.scss";
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
  return (
    <div className={styles.homeContainer}>
      <FitnessForm onSubmit={() => {}} />
    </div>
  );
}
