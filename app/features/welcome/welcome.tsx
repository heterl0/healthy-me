import { Line } from "@ant-design/charts";
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  List,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { useCallback, useState } from "react";

import { generateGeminiOutput } from "~/lib/gemini";

import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import styles from "./welcome.module.scss";

const chartData = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 74 },
  { month: "May", score: 79 },
  { month: "Jun", score: 82 },
];

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router docs",
  },
  {
    href: "https://ant.design/",
    text: "Ant Design",
  },
  {
    href: "https://charts.ant.design/",
    text: "Ant Design Charts",
  },
];

export function Welcome() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? "";
  const [prompt, setPrompt] = useState(
    "Give one short tip for staying hydrated.",
  );
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onAskGemini = useCallback(async () => {
    setError(null);
    setReply(null);
    if (!apiKey.trim()) {
      setError("Set VITE_GEMINI_API_KEY in .env (see .env.example).");
      return;
    }
    setLoading(true);
    try {
      const text = await generateGeminiOutput(prompt.trim());
      setReply(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gemini request failed.");
    } finally {
      setLoading(false);
    }
  }, [apiKey, prompt]);

  return (
    <div className={styles.page}>
      <div className={styles.brandRow}>
        <Typography.Title
          level={2}
          style={{ marginBottom: 4 }}
        ></Typography.Title>
        <Typography.Text type="secondary">
          TypeScript · Redux Toolkit · Ant Design · SCSS modules · Gemini (demo)
        </Typography.Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} lg={14}>
          <Card title="Welcome">
            <div className={styles.logoWrap}>
              <img
                src={logoLight}
                alt="React Router"
                className={styles.logoLight}
              />
              <img
                src={logoDark}
                alt="React Router"
                className={styles.logoDark}
              />
            </div>
            <Typography.Paragraph>
              Starter stack aligned for local demos: UI from Ant Design, charts
              from Ant Design Charts, global state from Redux Toolkit, styling
              helpers in SCSS modules, and Gemini called directly from the
              browser.
            </Typography.Paragraph>
            <Typography.Title level={5}>What&apos;s next?</Typography.Title>
            <List
              size="small"
              dataSource={resources}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.text}
                  </Typography.Link>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Demo chart" className={styles.chartCard}>
            <Line
              data={chartData}
              xField="month"
              yField="score"
              height={220}
              autoFit
              smooth
              animation={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Gemini (client demo)">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Typography.Text type="secondary">
                Uses <Typography.Text code>VITE_GEMINI_API_KEY</Typography.Text>
                . The key ships in the browser bundle—fine for this demo only.
              </Typography.Text>
              <Input.TextArea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Ask something short…"
              />
              <Button type="primary" onClick={onAskGemini} disabled={loading}>
                Ask Gemini
              </Button>
              {loading ? <Spin tip="Calling Gemini…" /> : null}
              {error ? <Alert type="error" showIcon message={error} /> : null}
              {reply ? (
                <Alert
                  type="success"
                  showIcon
                  message="Reply"
                  description={
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      {reply}
                    </Typography.Paragraph>
                  }
                />
              ) : null}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
