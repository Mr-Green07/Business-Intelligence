import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AppContext } from '../App';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  History,
  FileText,
  User,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function DataUpload() {
  const { token, user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'Processing', 'Completed', 'Failed'
  const [uploadMessage, setUploadMessage] = useState('');
  const [errorDetails, setByError] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchUploadHistory = () => {
    setLoadingHistory(true);
    fetch('/api/upload/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setHistory(data || []);
        setLoadingHistory(false);
      })
      .catch(err => {
        console.error('Error fetching upload history:', err);
        setLoadingHistory(false);
      });
  };

  useEffect(() => {
    fetchUploadHistory();
  }, [token]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setByError('');
      setUploadMessage('');
      setUploadStatus(null);
    } else {
      setByError('Please select a valid CSV file. (.csv extension)');
      setFile(null);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "date,state,category,product_name,revenue,orders,quantity\n"
      + "2026-07-20,Maharashtra,Electronics,Smartphones Pro X,18.45,22,40\n"
      + "2026-07-20,Karnataka,Furniture,Ergonomic Office Chair,6.30,14,14\n"
      + "2026-07-21,Delhi,Clothing,Premium Cotton Shirt,1.80,30,50\n"
      + "2026-07-21,Gujarat,Electronics,UltraSlim Laptop 15,19.50,12,15";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "businessiq_sales_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setByError('');
    setUploadStatus('Processing');
    setUploadMessage('Uploading files to server...');

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || 'Upload failed') });
        }
        return res.json();
      })
      .then(data => {
        setUploadStatus('Processing');
        setUploadMessage('Processing rows in background. Check notifications or refresh history shortly.');
        setFile(null);
        setUploading(false);
        
        // Refresh history shortly
        setTimeout(fetchUploadHistory, 2000);
      })
      .catch(err => {
        console.error('Error uploading file:', err);
        setUploadStatus('Failed');
        setUploadMessage(err.message);
        setUploading(false);
        fetchUploadHistory();
      });
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload card controls */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-max space-y-6">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-sky-500" />
              Upload Sales Log File (.CSV)
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Bulk import transactions into SQLite sales database</p>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            
            {/* Drag & Drop input area */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-500/40 dark:hover:border-sky-500/40 rounded-2xl p-8 text-center transition-all relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-3.5 pointer-events-none">
                <div className="p-3 bg-sky-500/10 text-sky-500 border border-sky-500/10 rounded-2xl w-max mx-auto">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(2)} KB • Ready to submit</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Drag & drop your CSV log, or click to browse</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Only standard comma-separated .csv logs supported</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error notifications or results */}
            {errorDetails && (
              <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl flex items-start gap-3 text-xs text-rose-800 dark:bg-rose-500/5 dark:border-rose-500/20 dark:text-rose-200 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>{errorDetails}</div>
              </div>
            )}

            {uploadStatus && (
              <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs animate-fadeIn ${
                uploadStatus === 'Failed'
                  ? 'bg-rose-50/20 border-rose-100 text-rose-800 dark:bg-rose-500/5 dark:border-rose-500/20 dark:text-rose-200'
                  : uploadStatus === 'Completed'
                  ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-200'
                  : 'bg-sky-50/20 border-sky-100 text-sky-800 dark:bg-sky-500/5 dark:border-sky-500/20 dark:text-sky-200'
              }`}>
                {uploadStatus === 'Failed' ? (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                ) : uploadStatus === 'Completed' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5 animate-spin" />
                )}
                <div>
                  <p className="font-bold">{uploadStatus}</p>
                  <p className="text-[11px] mt-0.5">{uploadMessage}</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!file || uploading}
                className="flex-1 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {uploading ? 'Processing File...' : 'Upload File'}
              </button>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>

        </div>

        {/* Templates guide panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-max space-y-6">
          
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">CSV Data Template Schema</h4>
            <p className="text-[10px] text-slate-400">Download and structure logs correctly before importing</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-3 font-mono text-slate-600 dark:text-slate-400">
            <p className="font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Header columns:</p>
            <p className="text-sky-600 dark:text-sky-400 font-bold">date,state,category,product_name,revenue,orders,quantity</p>
            <p className="border-t border-slate-200 dark:border-slate-700 pt-2 font-semibold">Rules:</p>
            <ul className="list-disc pl-4 space-y-1 text-[10px] font-sans">
              <li>Date: YYYY-MM-DD</li>
              <li>State: Must match target Indian states (e.g. Maharashtra, Punjab, etc.)</li>
              <li>Category: Electronics, Furniture, or Clothing</li>
              <li>Revenue: Positive decimal (₹ Lakhs)</li>
              <li>Orders/Quantity: Positive integer</li>
            </ul>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Sample CSV
          </button>

        </div>

      </div>

      {/* History log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        
        <div className="flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-800/40 pb-4">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">File Import Audit History</h3>
        </div>

        {loadingHistory ? (
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded"></div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">
            No past imports logged in database.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2">Uploaded File</th>
                  <th className="py-2.5 px-2">Timestamp</th>
                  <th className="py-2.5 px-2">User account</th>
                  <th className="py-2.5 px-2 text-center">Row entries</th>
                  <th className="py-2.5 px-2 text-center">Execution state</th>
                  <th className="py-2.5 px-2">Logs details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-600 dark:text-slate-400">
                {history.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {job.filename}
                    </td>
                    <td className="py-3 px-2 font-medium">
                      {new Date(job.uploaded_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {job.uploaded_by}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-800 dark:text-white">
                      {job.record_count.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        job.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : job.status === 'Failed'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                          : 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 animate-pulse'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 max-w-[200px] truncate font-medium text-[11px] text-slate-500" title={job.error_message}>
                      {job.error_message || <span className="text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Checked</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
