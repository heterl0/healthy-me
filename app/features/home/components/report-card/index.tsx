import { memo, useMemo, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Table,
  Typography,
} from "antd";
import { DualAxes, Line, Pie } from "@ant-design/charts";
import type { FitnessReport } from "~/shared/types";
import { useReportExportFilename } from "./hooks/use-report-export-filename";
import { useReportCardData } from "./hooks/use-report-card-data";
import { useReportPdfExport } from "./hooks/use-report-pdf-export";
import styles from "./styles.module.scss";

const { Paragraph, Text, Title } = Typography;

type Props = {
  data: FitnessReport;
};

function ReportCard({ data }: Props) {
  if (!data.report) {
    return (
      <Card className={styles.reportCard}>
        <Empty description="No report data available yet." />
      </Card>
    );
  }

  const { basicInfo, createdAt, report } = data;
  const reportContentRef = useRef<HTMLDivElement | null>(null);
  const filename = useReportExportFilename({
    name: basicInfo.name,
    createdAt,
  });
  const { exportPdf, isExporting } = useReportPdfExport({
    targetRef: reportContentRef,
    filename,
  });
  const {
    nutritionData,
    activityData,
    bodyData,
    exerciseData,
    lineData,
    minWeight,
    maxWeight,
    timelineProgress,
    estimatedWeeks,
    exerciseColumns,
  } = useReportCardData({ basicInfo, report });
  const weightScale = useMemo(
    () => ({
      y: {
        domainMin: Math.max(minWeight - 10, 0),
        domainMax: Math.min(maxWeight + 10, 150),
      },
    }),
    [maxWeight, minWeight],
  );

  return (
    <Card className={styles.reportCard}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.heading}>
            Personalized Health Report
          </Title>
          <Text type="secondary">
            Generated for {basicInfo.name} on{" "}
            {new Date(createdAt).toLocaleDateString("en-GB")}
          </Text>
        </div>
        <Button
          type="primary"
          onClick={exportPdf}
          loading={isExporting}
          disabled={isExporting}
        >
          Export PDF
        </Button>
      </div>

      <div ref={reportContentRef}>
        <Card className={styles.sectionCard} title="Summary">
          <Paragraph className={styles.summaryText}>{report.summary}</Paragraph>
          <div className={styles.metrics}>
            <Text>
              Current: <strong>{basicInfo.weight}kg</strong>
            </Text>
            <Text>
              Goal: <strong>{basicInfo.goalWeight}kg</strong>
            </Text>
            <Text>
              Height: <strong>{basicInfo.height}cm</strong>
            </Text>
            <Text>
              Age: <strong>{basicInfo.age}</strong>
            </Text>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className={styles.sectionCard} title="Nutrition Breakdown">
              <div className={styles.chartWrap}>
                <Pie
                  data={nutritionData}
                  angleField="value"
                  colorField="type"
                  label={{
                    text: "value",
                    position: "outside",
                    formatter: (v: string | number) => `${v}%`,
                  }}
                  legend={{ position: "bottom" }}
                  tooltip={{ items: [{ channel: "y", name: "percent" }] }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className={styles.sectionCard} title="Activity Composition">
              <div className={styles.chartWrap}>
                <Pie
                  data={activityData}
                  angleField="value"
                  colorField="type"
                  innerRadius={0.38}
                  label={{
                    text: "value",
                    formatter: (v: string | number) => `${v}%`,
                  }}
                  legend={{ position: "bottom" }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className={styles.sectionCard} title="Body Composition">
              <div className={styles.chartWrap}>
                <Pie
                  data={bodyData}
                  angleField="value"
                  colorField="type"
                  innerRadius={0.62}
                  label={{
                    text: "value",
                    formatter: (v: string | number) => `${v}%`,
                  }}
                  legend={{ position: "bottom" }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className={styles.sectionCard} title="Weight Progress">
              <div className={styles.chartWrap}>
                <Line
                  data={lineData}
                  xField="week"
                  yField="weight"
                  point
                  axis={{
                    y: { title: "Weight (kg)" },
                    x: { title: "Week" },
                  }}
                  style={{
                    lineWidth: 2,
                    lineDash: (data: { category: string }[]) => {
                      if (data[0].category === "goal") return [4, 4];
                    },
                    opacity: (data: { type: string }[]) => {
                      if (data[0].type !== "goal") return 0.5;
                    },
                  }}
                  scale={weightScale}
                  legend={{ size: false }}
                  colorField="category"
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Card className={styles.sectionCard} title="Exercise Effort">
          <div className={styles.chartWrapLarge}>
            <DualAxes
              data={exerciseData}
              xField="day"
              children={[
                {
                  type: "interval",
                  yField: "calories",
                  axis: { y: { title: "Calories" } },
                },
                {
                  type: "line",
                  yField: "minutes",
                  point: true,
                  axis: { y: { position: "right", title: "Minutes" } },
                  style: { lineWidth: 2, lineDash: [4, 4], stroke: "#b7e4c7" },
                },
              ]}
              legend={{ color: { position: "bottom" } }}
            />
          </div>
          <Table
            className={styles.table}
            rowKey="day"
            columns={exerciseColumns}
            dataSource={exerciseData}
            pagination={false}
            size="small"
          />
        </Card>

        <Card className={styles.sectionCard} title="Timeline to Goal">
          <Paragraph className={styles.timelineText}>
            Estimated duration: <strong>{estimatedWeeks} weeks</strong>. Current
            progress is <strong>{timelineProgress.toFixed(1)}%</strong> toward
            your target weight.
          </Paragraph>
          <Progress percent={Number(timelineProgress.toFixed(1))} />
        </Card>
      </div>
    </Card>
  );
}

export default memo(ReportCard);
