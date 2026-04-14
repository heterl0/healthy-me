import { Form, Input, InputNumber, Button, Select, Card } from "antd";
import { Activity } from "lucide-react";
import styles from "./styles.module.scss";
import type { FitnessFormData } from "~/shared/types";

type Props = {
  onSubmit: (data: FitnessFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export default function FitnessForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Profile",
}: Props) {
  const [form] = Form.useForm<FitnessFormData>();

  const handleSubmit = async (values: FitnessFormData) => {
    const formData: FitnessFormData = {
      name: values.name,
      age: values.age,
      weight: values.weight,
      height: values.height,
      goalWeight: values.goalWeight,
      timePerDay: values.timePerDay,
    };
    await onSubmit(formData);
  };

  return (
    <Card className={styles.formCard}>
      <div className={styles.formHeader}>
        <Activity className={styles.headerIcon} />
        <h1 className={styles.title}>Fitness Tracker</h1>
      </div>
      <p className={styles.subtitle}>
        {isSubmitting
          ? "Analyzing your profile with AI..."
          : "Track your fitness progress and goals"}
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        autoComplete="off"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="John Doe" className={styles.input} />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Please enter your age" },
              {
                type: "number",
                min: 1,
                max: 150,
                message: "Please enter a valid age",
              },
            ]}
            className={styles.formCol}
          >
            <InputNumber placeholder="25" min={1} max={150} />
          </Form.Item>

          <Form.Item
            label="Height (cm)"
            name="height"
            rules={[
              { required: true, message: "Please enter your height" },
              {
                type: "number",
                min: 50,
                max: 250,
                message: "Please enter a valid height",
              },
            ]}
            className={styles.formCol}
          >
            <InputNumber placeholder="175" min={50} max={250} />
          </Form.Item>
        </div>

        <div className={styles.formRow}>
          <Form.Item
            label="Current Weight (kg)"
            name="weight"
            rules={[
              { required: true, message: "Please enter your weight" },
              {
                type: "number",
                min: 20,
                max: 500,
                message: "Please enter a valid weight",
              },
            ]}
            className={styles.formCol}
          >
            <InputNumber placeholder="75" min={20} max={500} />
          </Form.Item>

          <Form.Item
            label="Goal Weight (kg)"
            name="goalWeight"
            rules={[
              { required: true, message: "Please enter your goal weight" },
              {
                type: "number",
                min: 20,
                max: 500,
                message: "Please enter a valid goal weight",
              },
            ]}
            className={styles.formCol}
          >
            <InputNumber placeholder="70" min={20} max={500} />
          </Form.Item>
        </div>

        <Form.Item
          label="Time per Day for Exercise (minutes)"
          name="timePerDay"
          rules={[
            { required: true, message: "Please select exercise duration" },
          ]}
        >
          <Select placeholder="Select duration" style={{ height: 40 }}>
            <Select.Option value="15">15 minutes</Select.Option>
            <Select.Option value="30">30 minutes</Select.Option>
            <Select.Option value="45">45 minutes</Select.Option>
            <Select.Option value="60">60 minutes</Select.Option>
            <Select.Option value="90">90 minutes</Select.Option>
            <Select.Option value="120">120 minutes</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            size="large"
            className={styles.submitButton}
          >
            {submitLabel}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
