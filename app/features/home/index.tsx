import { useState } from "react";
import { message } from "antd";
import { AnimatePresence, motion } from "motion/react";
import type { FitnessBasicInfo, FitnessReport } from "~/shared/types";
import FitnessForm from "./components/form-fitness";
import ReportCard from "./components/report-card";
import styles from "./styles.module.scss";
import { generateGeminiOutput, generatePrompt } from "~/lib/gemini";
import { FitnessSchema } from "~/shared/schema/fitness";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
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
  const { reportList } = useAppSelector(({ app }) => app);
  const [currentReport, setCurrentReport] = useState<FitnessReport | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function onSubmit(basicInfo: FitnessBasicInfo) {
    setIsAnalyzing(true);
    try {
      const prompt = generatePrompt(basicInfo);
      const response = await generateGeminiOutput(prompt, {
        responseMimeType: "application/json",
        responseJsonSchema: FitnessSchema.toJSONSchema(),
      });
      const reportData = FitnessSchema.parse(JSON.parse(response));
      const nextReport: FitnessReport = {
        id: crypto.randomUUID(),
        basicInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        report: reportData,
      };
      dispatch(addReport(nextReport));
      setCurrentReport(nextReport);
    } catch {
      message.error("AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <motion.div layout className={styles.homeContainer}>
      <motion.div layout className={styles.transitionCard}>
        <AnimatePresence mode="wait">
          {!currentReport ? (
            <motion.div
              key="form-step"
              layout
              layoutId="home-shared-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                type: "spring",
                visualDuration: 0.35,
                bounce: 0.2,
                layout: { duration: 0.35 },
              }}
            >
              <FitnessForm
                onSubmit={onSubmit}
                isSubmitting={isAnalyzing}
                submitLabel={
                  isAnalyzing ? "Analyzing with AI..." : "Generate AI Report"
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="report-step"
              layout
              layoutId="home-shared-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                type: "spring",
                visualDuration: 0.35,
                bounce: 0.2,
                layout: { duration: 0.4 },
              }}
            >
              <ReportCard data={currentReport} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {!!reportList.length && !currentReport && (
        <p className={styles.historyHint}>
          {reportList.length} report(s) generated in this session.
        </p>
      )}
    </motion.div>
  );
}
