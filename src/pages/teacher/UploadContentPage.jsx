import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Field } from "../../components/UI";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { AppLayout } from "../../layouts/AppLayout";
import { toLocalInputValue } from "../../utils/date";

const schema = z
  .object({
    title: z.string().min(2, "Title is required."),
    subject: z.string().min(1, "Subject is required."),
    description: z.string().optional(),
    file: z.any().refine((files) => files?.length === 1, "File is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    rotationDuration: z.coerce.number().min(5).max(120),
  })
  .refine((values) => new Date(values.endTime) > new Date(values.startTime), {
    message: "End time must be after start time.",
    path: ["endTime"],
  })
  .refine((values) => {
    const file = values.file?.[0];
    return file ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : true;
  }, { message: "Only JPG, PNG, or GIF files are allowed.", path: ["file"] })
  .refine((values) => {
    const file = values.file?.[0];
    return file ? file.size <= 10 * 1024 * 1024 : true;
  }, { message: "File must be 10MB or smaller.", path: ["file"] });

export function UploadContentPage() {
  const { user } = useAuth();
  const { uploadContent } = useContent();
  const { notify } = useToast();
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const now = useMemo(() => new Date(), []);
  const later = useMemo(() => new Date(Date.now() + 4 * 60 * 60 * 1000), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "Mathematics",
      rotationDuration: 15,
      startTime: toLocalInputValue(now),
      endTime: toLocalInputValue(later),
    },
  });

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function onSubmit(values) {
    const file = values.file[0];
    setSubmitting(true);
    try {
      await uploadContent({
        teacherId: user.id,
        teacherName: user.name,
        title: values.title,
        subject: values.subject,
        description: values.description || "Broadcast content prepared for students.",
        fileName: file.name,
        fileType: file.type,
        previewUrl: preview,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        rotationDuration: values.rotationDuration,
      });
      notify("Content submitted for approval.");
      reset();
      setPreview("");
    } catch (err) {
      notify(err.message || "Upload failed.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout title="Upload Content" subtitle="Prepare visual content, schedule it, and send it for principal approval.">
      <form className="upload-grid" onSubmit={handleSubmit(onSubmit)}>
        <section className="section form-section">
          <Field label="Title" error={errors.title?.message}>
            <input {...register("title")} placeholder="e.g. Fractions quick revision" />
          </Field>
          <Field label="Subject" error={errors.subject?.message}>
            <select {...register("subject")}>
              <option>Mathematics</option>
              <option>Science</option>
              <option>History</option>
              <option>English</option>
              <option>Computer Science</option>
            </select>
          </Field>
          <Field label="Description">
            <textarea {...register("description")} placeholder="Short context for the broadcast" rows={4} />
          </Field>
          <div className="form-row">
            <Field label="Start time" error={errors.startTime?.message}>
              <input type="datetime-local" {...register("startTime")} />
            </Field>
            <Field label="End time" error={errors.endTime?.message}>
              <input type="datetime-local" {...register("endTime")} />
            </Field>
          </div>
          <Field label="Rotation duration seconds">
            <input type="number" min="5" max="120" {...register("rotationDuration")} />
          </Field>
          <Button disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} /> : <UploadCloud size={18} />}
            Submit for approval
          </Button>
        </section>
        <section className="section upload-drop">
          <label className="drop-zone">
            <input type="file" accept="image/jpeg,image/png,image/gif" {...register("file")} onChange={(event) => {
              register("file").onChange(event);
              onFileChange(event);
            }} />
            {preview ? <img src={preview} alt="File preview" /> : <ImagePlus size={42} />}
            <strong>{preview ? "Preview ready" : "Drop or choose a JPG, PNG, or GIF"}</strong>
            <span>Maximum file size 10MB</span>
          </label>
          {errors.file?.message ? <small className="field-error">{errors.file.message}</small> : null}
        </section>
      </form>
    </AppLayout>
  );
}
