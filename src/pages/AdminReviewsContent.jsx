import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage } from "../services/uploadApi";

const reviewsEmptyContent = {
  testimonials: [
    { name: "Jenny Wilson", role: "Web Developer", message: "OMG! I cannot believe that I have got a brand new landing page after getting appmax. It was super easy to edit and publish.", avatar: "" },
    { name: "Robert Fox", role: "Product Designer", message: "The process was smooth and intuitive. Everything worked exactly as expected.", avatar: "" },
    { name: "Esther Howard", role: "Founder", message: "Excellent service and great attention to detail. Highly recommended.", avatar: "" },
    { name: "Jenny Wilson", role: "Web Developer", message: "OMG! I cannot believe that I have got a brand new landing page after getting appmax. It was super easy to edit and publish.", avatar: "" },
    { name: "Robert Fox", role: "Product Designer", message: "The process was smooth and intuitive. Everything worked exactly as expected.", avatar: "" },
    { name: "Esther Howard", role: "Founder", message: "Excellent service and great attention to detail. Highly recommended.", avatar: "" },
  ],
};

function mergeReviewsContent(empty, data) {
  const testimonials = Array.isArray(data?.testimonials) && data.testimonials.length > 0 ? data.testimonials : empty.testimonials;
  // Ensure at least 6 testimonials, pad if needed
  const paddedTestimonials = [...testimonials];
  while (paddedTestimonials.length < 6) {
    paddedTestimonials.push({ name: "", role: "", message: "", avatar: "" });
  }
  return {
    testimonials: paddedTestimonials.slice(0, 20), // Allow up to 20 testimonials
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminReviewsContent() {
  const [content, setContent] = useState(reviewsEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("reviews")
      .then((data) => {
        setContent(mergeReviewsContent(reviewsEmptyContent, data && typeof data === "object" ? data : {}));
      })
      .catch((err) => {
        setContent(mergeReviewsContent(reviewsEmptyContent, {}));
        setError(err.message || "Failed to load Reviews content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateTestimonial = (index, field, value) => {
    setContent((c) => {
      const testimonials = [...(c.testimonials || [])];
      testimonials[index] = { ...(testimonials[index] || {}), [field]: value };
      return { ...c, testimonials };
    });
  };

  const addTestimonial = () => {
    setContent((c) => ({
      ...c,
      testimonials: [...(c.testimonials || []), { name: "", role: "", message: "", avatar: "" }],
    }));
  };

  const removeTestimonial = (index) => {
    setContent((c) => {
      const testimonials = (c.testimonials || []).filter((_, i) => i !== index);
      return { ...c, testimonials };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("reviews", content);
      toast.success("Saved successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
  const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Reviews Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Reviews Content</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <label style={labelStyle}>Testimonials</label>
          <button
            type="button"
            onClick={addTestimonial}
            style={{ padding: "6px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
          >
            + Add Testimonial
          </button>
        </div>

        {(content.testimonials || []).map((testimonial, index) => (
          <div key={index} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Testimonial {index + 1}</span>
              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                style={{ padding: "4px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
              >
                Remove
              </button>
            </div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={testimonial.name || ""} onChange={(e) => updateTestimonial(index, "name", e.target.value)} />
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} value={testimonial.role || ""} onChange={(e) => updateTestimonial(index, "role", e.target.value)} />
            <label style={labelStyle}>Message</label>
            <textarea style={inputStyle} rows={3} value={testimonial.message || ""} onChange={(e) => updateTestimonial(index, "message", e.target.value)} />
            <label style={labelStyle}>Avatar (URL or upload)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={testimonial.avatar || ""} onChange={(e) => updateTestimonial(index, "avatar", e.target.value)} placeholder="Paste URL or upload below" />
              {(testimonial.avatar && isImageUrl(testimonial.avatar)) && <img src={testimonial.avatar} alt="" style={thumbStyle} />}
            </div>
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImageUploading(`testimonial-${index}`);
              try {
                const url = await uploadImage(file);
                updateTestimonial(index, "avatar", url);
              } catch (err) { setError(err.message || "Image upload failed"); }
              setImageUploading(null);
            }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
            {imageUploading === `testimonial-${index}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
