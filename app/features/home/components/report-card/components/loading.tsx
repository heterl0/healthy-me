import { Card, Flex, Skeleton } from "antd";
import styles from "../styles.module.scss";
function ReportCardLoading() {
  return (
    <Card className={styles.reportCard}>
      <Flex
        justify="center"
        align="center"
        style={{
          flexDirection: "column",
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </Flex>
    </Card>
  );
}

export default ReportCardLoading;
