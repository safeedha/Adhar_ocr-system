import React, { useState } from "react";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./uploadform.css";

const UploadForm = () => {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFrontUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFront(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBack(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!front || !back) {
      toast.warning("⚠️ Please upload both Aadhaar front and back images!");
      return;
    }

    const formData = new FormData();
    formData.append("front", front);
    formData.append("back", back);

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_PORT}/api/ocr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if(res.data.message.status===false)
      {
        toast.error(res.data.message.message)
      }
      else{
      toast.success("✅ OCR Processed Successfully!");
      setResult(res.data.message.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ OCR Failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <h2 className="title">Aadhaar OCR</h2>
      <div className="container">
   
        <form onSubmit={handleSubmit} className="form">
   
          <label className="upload-box">
            <p>Aadhaar Front</p>
            <div className="upload-content">
              {frontPreview ? (
                <img src={frontPreview} alt="Front Preview" className="preview-img" />
              ) : (
                <>
                  <FiUploadCloud size={40} color="#6c63ff" />
                  <span>Click here to Upload/Capture</span>
                </>
              )}
              <input type="file" accept="image/*" hidden onChange={handleFrontUpload} />
            </div>
          </label>

          <label className="upload-box">
            <p>Aadhaar Back</p>
            <div className="upload-content">
              {backPreview ? (
                <img src={backPreview} alt="Back Preview" className="preview-img" />
              ) : (
                <>
                  <FiUploadCloud size={40} color="#6c63ff" />
                  <span>Click here to Upload/Capture</span>
                </>
              )}
              <input type="file" accept="image/*" hidden onChange={handleBackUpload} />
            </div>
          </label>

          <button type="submit" className="submit-btn">
            {loading ? "Processing..." : "PARSE AADHAAR"}
          </button>
        </form>

     
        <div className="result-box">
          {!loading && !result && (
            <p className="placeholder-text">Results will be displayed here after submitting.</p>
          )}

          {result && (
            <div className="parsed-details">
              <h3>Parsed Details</h3>
              <div className="details-grid">
                <div className="detail-card">
                  <p>Name</p>
                  <span>{result.Name || "N/A"}</span>
                </div>
                <div className="detail-card">
                  <p>Aadhaar Number</p>
                  <span>{result.aadhaarNumber || "N/A"}</span>
                </div>
                <div className="detail-card">
                  <p>Date of Birth</p>
                  <span>{result.dob || "N/A"}</span>
                </div>
                <div className="detail-card">
                  <p>Gender</p>
                  <span>{result.gender || "N/A"}</span>
                </div>
                <div className="detail-card">
                  <p>Pincode</p>
                  <span>{result.pincode || "N/A"}</span>
                </div>
                <div className="detail-card">
                  <p>Age</p>
                  <span>{result.age || "N/A"}</span>
                </div>
                <div className="detail-card full-width">
                  <p>Address</p>
                  <span>{result.address || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadForm;
