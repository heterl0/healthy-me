import { Card, Col, Empty, Progress, Row, Table, Typography } from "antd";
import { DualAxes, Line, Pie } from "@ant-design/charts";
import type { FitnessReport } from "~/shared/types";
import styles from "./styles.module.scss";

const { Paragraph, Text, Title } = Typography;

type Props = {
  data: FitnessReport;
};

type PieDatum = {
  type: string;
  value: number;
};

function toPercentData(record: Record<string, number>): PieDatum[] {
  return Object.entries(record).map(([type, value]) => ({
    type: type.replace(/_/g, " "),
    value,
  }));
}

function ReportCard({ data }: Props) {
  if (!data.report) {
    return (
      <Card className={styles.reportCard}>
        <Empty description="No report data available yet." />
      </Card>
    );
  }

  const { basicInfo, createdAt, report } = data;
  const nutritionData = toPercentData(report.nutrition_breakdown);
  const activityData = toPercentData(report.activity_composition);
  const bodyData = toPercentData(report.body_composition);

  const exerciseData = report.exercise_effort.map((item) => ({
    day: item.date,
    calories: item.calories_burned,
    minutes: item.duration_minutes,
  }));

  const weightData = report.weight_progress.weekly_data.map((item) => ({
    week: item.week,
    weight: item.weight,
  }));

  const startWeight = basicInfo.weight;
  const currentWeight =
    weightData.length > 0 ? weightData[weightData.length - 1].weight : startWeight;
  const goalWeight = report.weight_progress.goal_weight;
  const totalNeed = Math.max(0, startWeight - goalWeight);
  const done = Math.max(0, startWeight - currentWeight);
  const timelineProgress = totalNeed > 0 ? Math.min(100, (done / totalNeed) * 100) : 100;
  const estimatedWeeks = report.weight_progress.weekly_data.length;

  const exerciseColumns = [
    { title: "Date", dataIndex: "day", key: "day" },
    { title: "Calories Burned", dataIndex: "calories", key: "calories" },
    { title: "Duration (min)", dataIndex: "minutes", key: "minutes" },
  ];

  return (
    <Card className={styles.reportCard}>
      <div className={styles.header}>
        <Title level={2} className={styles.heading}>
          Personalized Health Report
        </Title>
        <Text type="secondary">
          Generated for {basicInfo.name} on{" "}
          {new Date(createdAt).toLocaleDateString("en-GB")}
        </Text>
      </div>

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
                innerRadius={0.62}
                label={{
                  text: "value",
                  formatter: (v: string | number) => `${v}%`,
                }}
                legend={{ position: "bottom" }}
                tooltip={{ items: [{ channel: "y", name: "Percent" }] }}
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
                data={weightData}
                xField="week"
                yField="weight"
                point
                axis={{
                  y: { title: "Weight (kg)" },
                  x: { title: "Week" },
                }}
                annotations={[
                  {
                    type: "lineY",
                    y: goalWeight,
                    style: { stroke: "#ff4d4f", lineDash: [4, 4] },
                    text: { content: `Goal ${goalWeight}kg`, position: "left" },
                  },
                ]}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Card className={styles.sectionCard} title="Exercise Effort">
        <div className={styles.chartWrapLarge}>
          <DualAxes
            data={[exerciseData, exerciseData]}
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
                axis: { y: { position: "right", title: "Minutes" } },
                style: { stroke: "#1677ff", lineWidth: 2 },
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
          progress is <strong>{timelineProgress.toFixed(1)}%</strong> toward your
          target weight.
        </Paragraph>
        <Progress percent={Number(timelineProgress.toFixed(1))} />
      </Card>
    </Card>
  );
}

export default ReportCard;
