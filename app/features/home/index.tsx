import type { FitnessBasicInfo, FitnessReport } from "~/shared/types";
import FitnessForm from "./components/form-fitness";
import styles from "./styles.module.scss";
import { generateGeminiOutput, generatePrompt } from "~/lib/gemini";
import { FitnessSchema } from "~/shared/schema/fitness";
import { useAppDispatch } from "~/store/hooks";
import { addReport } from "~/store/appSlice";

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
  const dispatch = useAppDispatch();

  async function onSubmit(basicInfo: FitnessBasicInfo) {
    const prompt = generatePrompt(basicInfo);
    const response = await generateGeminiOutput(prompt, {
      responseMimeType: "application/json",
      responseJsonSchema: FitnessSchema.toJSONSchema(),
    });
    console.log(response);
    const reportData = FitnessSchema.parse(JSON.parse(response));
    const report: FitnessReport = {
      id: crypto.randomUUID(),
      basicInfo,
      createdAt: new Date().toISOString(),
      report: reportData,
    };
    dispatch(addReport(report));
    console.log(report);
  }

  return (
    <div className={styles.homeContainer}>
      <FitnessForm onSubmit={onSubmit} />
    </div>
  );
}
