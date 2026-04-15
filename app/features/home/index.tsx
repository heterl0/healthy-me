import { Activity, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  Layout,
  List,
  Space,
  Tag,
  Typography,
  Grid,
  message,
  Image,
  Flex,
} from "antd";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardList, History, Menu } from "lucide-react";
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
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isDesktop = !!screens.lg;
  const dispatch = useAppDispatch();
  const { reportList } = useAppSelector(({ app }) => app);
  const [currentReport, setCurrentReport] = useState<FitnessReport | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const historyItems = useMemo(() => [...reportList].reverse(), [reportList]);

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

  const historyContent = (
    <div className={styles.historyPanel}>
      <Activity mode={isDesktop ? "visible" : "hidden"}>
        <div className={styles.historyHeader}>
          <History width={16} height={16} />
          <Typography.Title level={5} className={styles.historyTitle}>
            History
          </Typography.Title>
        </div>
      </Activity>

      <List
        locale={{ emptyText: "No reports yet." }}
        dataSource={historyItems}
        renderItem={(item) => {
          const isActive = currentReport?.id === item.id;
          return (
            <List.Item
              key={item.id}
              className={`${styles.historyItem} ${
                isActive ? styles.historyItemActive : ""
              }`}
              onClick={() => onSelectReport(item)}
            >
              <Space
                direction="vertical"
                size={4}
                className={styles.historyMeta}
              >
                <Typography.Text strong>{item.basicInfo.name}</Typography.Text>
                <Typography.Text type="secondary">
                  {new Date(item.createdAt).toLocaleString("en-GB")}
                </Typography.Text>
                <Space size={8}>
                  <Tag color={item.report ? "green" : "default"}>
                    {item.report ? "Report ready" : "Draft"}
                  </Tag>
                  <Typography.Text type="secondary">
                    Goal {item.basicInfo.goalWeight}kg
                  </Typography.Text>
                </Space>
              </Space>
            </List.Item>
          );
        }}
      />
    </div>
  );

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
                    layout: { duration: 0.35 },
                  }}
                >
                  <FitnessForm
                    onSubmit={onSubmit}
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
        </Layout.Content>

        {isDesktop ? (
          <Layout.Sider
            width={340}
            theme="light"
            collapsible
            collapsedWidth={0}
            reverseArrow
            trigger={null}
            collapsed={!isHistoryOpen}
            className={styles.desktopSider}
          >
            {historyContent}
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
            height="65vh"
            onClose={() => setIsHistoryOpen(false)}
          >
            {historyContent}
          </Drawer>
        )}
      </Layout>
    </Layout>
  );
}
