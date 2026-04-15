import { Button, Card, Form, Image, Input, InputNumber, Select } from "antd";
import type { FitnessBasicInfo, FitnessFormData } from "~/shared/types";
import styles from "./styles.module.scss";

const TIME_PER_DAY_OPTIONS = [
  { label: "15 minutes", value: "15" },
  { label: "30 minutes", value: "30" },
  { label: "45 minutes", value: "45" },
  { label: "60 minutes", value: "60" },
  { label: "90 minutes", value: "90" },
  { label: "120 minutes", value: "120" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

type Props = {
  onSubmit: (data: FitnessFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

function FitnessForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Profile",
}: Props) {
  const [form] = Form.useForm<FitnessFormData>();

  const handleSubmit = async (values: FitnessFormData) => {
    const payload: FitnessBasicInfo = {
      ...values,
      target:
        values.goalWeight > values.weight
          ? "Weight Gain"
          : values.goalWeight < values.weight
            ? "Weight Loss"
            : "Maintenance",
    };
    await onSubmit(payload);
  };

  return (
    <Card className={styles.formCard}>
      <div className={styles.formHeader}>
        <Image src="/logo.png" alt="HeathyMe" height={40} preview={false} />
        <h1 className={styles.title}>Fitness Report</h1>
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
        <div className={styles.formRow}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
            className={styles.formCol}
          >
            <Input
              disabled={isSubmitting}
              placeholder="Hieu Le Van"
              className={styles.input}
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Select
              disabled={isSubmitting}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              style={{ height: 40 }}
            />
          </Form.Item>
        </div>

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
            <InputNumber
              disabled={isSubmitting}
              placeholder="25"
              min={1}
              max={150}
            />
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
            <InputNumber
              disabled={isSubmitting}
              placeholder="175"
              min={50}
              max={250}
            />
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
            <InputNumber
              disabled={isSubmitting}
              placeholder="75"
              min={20}
              max={500}
            />
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
            <InputNumber
              disabled={isSubmitting}
              placeholder="70"
              min={20}
              max={500}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Time per Day for Exercise (minutes)"
          name="timePerDay"
          rules={[
            { required: true, message: "Please select exercise duration" },
          ]}
          style={{ marginBottom: "2rem" }}
        >
          <Select
            disabled={isSubmitting}
            options={TIME_PER_DAY_OPTIONS}
            placeholder="Select duration"
            style={{ height: 40 }}
          />
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

export default FitnessForm;
