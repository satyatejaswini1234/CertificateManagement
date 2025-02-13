import React, { useState } from "react";
import axios from "axios";


const FacultyCertificates = () => {
  const [filters, setFilters] = useState({
    section: "",
    courseName: "",
  });
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCertificates = () => {
    setError("");
    axios
      .get("http://localhost:5000/api/nptel_certificates", { params: filters })
      .then((res) => {
        // Log the response to see the actual data structure
        console.log("Certificate data:", res.data);
        setCertificates(res.data);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
        setError("Failed to fetch certificates. Please try again.");
      });
  };
  const downloadExcel = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(
        "http://localhost:5000/api/nptel_certificates/download",
        {
          params: filters,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "nptel_certificates.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading excel:", err);
      setError("Failed to download excel file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };
  const clearFilters = () => {
    setFilters({ section: "", courseName: "" });
    setCertificates([]);
    setError("");
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-bold mb-4">Filter NPTEL Certificates</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Section</label>
            <input
              type="text"
              value={filters.section}
              onChange={(e) => handleFilterChange("section", e.target.value)}
              placeholder="Enter section"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Course Name</label>
            <input
              type="text"
              value={filters.courseName}
              onChange={(e) => handleFilterChange("courseName", e.target.value)}
              placeholder="Enter course name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchCertificates}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={downloadExcel}
              disabled={downloading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {downloading ? "Downloading..." : "Download Excel"}
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Filtered NPTEL Certificates</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((item, index) => (
              <div key={index} className="border rounded p-4">
                <h3 className="font-semibold mb-2">{item.course_name}</h3>
                {item.certificate_path &&
                item.certificate_path.endsWith(".pdf") ? (
                  <embed
                    src={`http://localhost:5000${item.certificate_path}`}
                    type="application/pdf"
                    className="w-full h-64"
                  />
                ) : item.certificate_path ? (
                  <img
                    src={`http://localhost:5000${item.certificate_path}`}
                    alt="Certificate"
                    className="w-full h-64 object-contain"
                  />
                ) : (
                  <p className="text-gray-500">No preview available</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No NPTEL certificates found.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyCertificates;
