import { Activity } from "react";
import { History } from "lucide-react";
import { List, Space, Tag, Typography } from "antd";
import type { FitnessReport } from "~/shared/types";
import styles from "./styles.module.scss";

type HistoryPanelProps = {
  isDesktop: boolean;
  historyItems: FitnessReport[];
  currentReportId?: string;
  isAnalyzing: boolean;
  onSelectReport: (report: FitnessReport) => void;
};

function HistoryPanel({
  isDesktop,
  historyItems,
  currentReportId,
  isAnalyzing,
  onSelectReport,
}: HistoryPanelProps) {
  return (
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
          const isActive = currentReportId === item.id;
          const isDisabled = isAnalyzing;
          return (
            <List.Item
              key={item.id}
              className={`${styles.historyItem} ${isDisabled ? styles.historyItemDisabled : ""} ${
                isActive ? styles.historyItemActive : ""
              }`}
              onClick={() => !isDisabled && onSelectReport(item)}
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
}

export default HistoryPanel;
