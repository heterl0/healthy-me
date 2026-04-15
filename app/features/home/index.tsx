import { Button, Drawer, Flex, Image, Layout, message } from "antd";
import { ClipboardList, History, Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useMemo, useState } from "react";
import {
  DEFAULT_MODELS,
  generateGeminiOutput,
  generatePrompt,
} from "~/lib/gemini";
import { useIsDesktop } from "~/shared/hooks/use-is-desktop";
import { useNavigationGuard } from "~/shared/hooks/use-navigation-guard";
import { FitnessSchema } from "~/shared/schema/fitness";
import type { FitnessBasicInfo, FitnessReport } from "~/shared/types";
import { addReport } from "~/store/appSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import FitnessForm from "./components/form-fitness";
import ReportCardLoading from "./components/report-card/components/loading";
import HistoryPanel from "./components/history-panel";
import { useReportToLocalStorage } from "./hooks/use-report-to-local-storage";
import styles from "./styles.module.scss";

const ReportCard = lazy(() => import("./components/report-card"));

export function meta() {
  return [
    { title: "Healthy Me AI" },
    {
      name: "description",
      content: "Personalized fitness report generator using AI.",
    },
  ];
}

function Home() {
  const isDesktop = useIsDesktop();
  const dispatch = useAppDispatch();
  const { reportList } = useAppSelector(({ app }) => app);

  useReportToLocalStorage({ reportList });

  const [currentReport, setCurrentReport] = useState<FitnessReport | null>(
    null,
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useNavigationGuard({ isBlocked: isAnalyzing });

  const historyItems = useMemo(() => [...reportList].reverse(), [reportList]);

  async function handleSubmit(basicInfo: FitnessBasicInfo) {
    setIsAnalyzing(true);
    try {
      const prompt = generatePrompt(basicInfo);
      const model =
        DEFAULT_MODELS[Math.floor(Math.random() * DEFAULT_MODELS.length)];
      const response = await generateGeminiOutput(prompt, model, {
        responseMimeType: "application/json",
        responseJsonSchema: FitnessSchema.toJSONSchema(),
        temperature: 0.2,
        topP: 0.4,
      });
      const reportData = FitnessSchema.parse(JSON.parse(response));
      const nextReport: FitnessReport = {
        id: crypto.randomUUID(),
        basicInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        report: reportData,
        createdBy: model,
      };
      dispatch(addReport(nextReport));
      setCurrentReport(nextReport);
    } catch {
      message.error("AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function onClickLogo() {
    setCurrentReport(null);
  }

  function onToggleHistory() {
    setIsHistoryOpen((prev) => !prev);
  }

  function onSelectReport(report: FitnessReport) {
    setCurrentReport(report);
    setIsHistoryOpen(false);
  }

  return (
    <Layout className={styles.homeLayout}>
      <Layout.Header className={styles.topBar}>
        <button type="button" onClick={onClickLogo} className={styles.brand}>
          {isDesktop ? (
            <Image
              src="/logo-full.png"
              alt="HeathyMe"
              height={56}
              preview={false}
            />
          ) : (
            <Image src="/logo.png" alt="HeathyMe" height={40} preview={false} />
          )}
        </button>
        <Button
          icon={isDesktop ? <History size={16} /> : <Menu size={16} />}
          onClick={onToggleHistory}
        >
          {isDesktop ? "History" : ""}
        </Button>
      </Layout.Header>

      <Layout className={styles.mainLayout}>
        <Layout.Content className={styles.mainContent}>
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
                    layout: { duration: 0.2 },
                  }}
                >
                  <FitnessForm
                    onSubmit={handleSubmit}
                    isSubmitting={isAnalyzing}
                    submitLabel={
                      isAnalyzing
                        ? "Analyzing with AI..."
                        : "Generate AI Report"
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
                  <Suspense fallback={<ReportCardLoading />}>
                    <ReportCard data={currentReport} />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {!!reportList.length && !currentReport && (
            <p className={styles.historyHint}>
              {reportList.length} report(s) generated in this session.
            </p>
          )}
        </Layout.Content>

        {isDesktop ? (
          <Layout.Sider
            width={340}
            theme="light"
            reverseArrow
            trigger={null}
            aria-hidden={!isHistoryOpen}
            hidden={!isHistoryOpen}
            className={styles.desktopSider}
          >
            <HistoryPanel
              isDesktop={isDesktop}
              historyItems={historyItems}
              currentReportId={currentReport?.id}
              isAnalyzing={isAnalyzing}
              onSelectReport={onSelectReport}
            />
          </Layout.Sider>
        ) : (
          <Drawer
            className={styles.mobileHistoryDrawer}
            title={
              <Flex align="center" gap={8}>
                <ClipboardList size={16} />
                <span>History</span>
              </Flex>
            }
            open={isHistoryOpen}
            placement="bottom"
            size="65%"
            onClose={() => setIsHistoryOpen(false)}
          >
            <HistoryPanel
              isDesktop={isDesktop}
              historyItems={historyItems}
              currentReportId={currentReport?.id}
              isAnalyzing={isAnalyzing}
              onSelectReport={onSelectReport}
            />
          </Drawer>
        )}
      </Layout>
    </Layout>
  );
}

export default Home;
