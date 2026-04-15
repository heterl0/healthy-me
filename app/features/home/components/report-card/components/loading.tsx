import { Flex, Skeleton } from "antd";

function ReportCardLoading() {
  return (
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
  );
}

export default ReportCardLoading;
