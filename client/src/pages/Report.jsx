/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, FileText, CheckCircle, Loader2 } from 'lucide-react';

const StepIndicator = ({ step }) => (
  <div className="flex justify-between items-center mb-8 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
    <div 
      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-secondary)] -z-10 rounded-full transition-all duration-300"
      style={{ width: `${((step - 1) / 3) * 100}%` }}
    ></div>
    
    {[1, 2, 3, 4].map((num) => (
      <div 
        key={num} 
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
          step >= num 
            ? 'bg-[var(--color-primary)] border-[var(--color-secondary)] text-white shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
            : 'bg-[var(--color-surface)] border-gray-600 text-gray-500'
        }`}
      >
        {step > num ? <CheckCircle size={18} className="text-[var(--color-secondary)]" /> : num}
      </div>
    ))}
  </div>
);

const Report = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: { address: '', coordinates: { lat: 22.3072, lng: 73.1812 } }, // Default to Vadodara
  });
  
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [aiData, setAiData] = useState(null);

  const categories = ['Pothole', 'Garbage', 'Streetlight', 'Water', 'Traffic', 'Construction', 'Noise', 'Other'];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setPhotos(files);
    
    // Create previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const analyzeDescription = async () => {
    if (!formData.description) return;
    setAnalyzing(true);
    try {
      const { data } = await axios.post('/api/ai/categorize', { description: formData.description });
      setAiData(data);
      if (data.category && !formData.category) {
        setFormData(prev => ({ ...prev, category: data.category }));
      }
    } catch (error) {
      console.error(error);
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('location', JSON.stringify(formData.location));
    
    photos.forEach(photo => {
      submitData.append('photos', photo);
    });

    if (aiData) {
      submitData.append('aiCategory', aiData.category);
      submitData.append('aiPriority', aiData.priority);
      submitData.append('aiSuggestion', aiData.suggestion);
    }

    try {
      await axios.post('/api/issues', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue');
    }
    setLoading(false);
  };



  return (
    <div className="min-h-[calc(100vh-[65px])] py-12 px-6 relative">
      <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-3xl border border-[var(--color-secondary)] border-opacity-30">
        <h1 className="text-3xl font-serif font-bold mb-2">Report a Civic Issue</h1>
        <p className="text-gray-400 mb-8">Help us make Vadodara better by reporting local problems.</p>
        
        <StepIndicator step={step} />

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Basic Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Issue Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                      placeholder="e.g. Huge pothole on VIP Road"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category (Optional - AI can detect this)</label>
                    <select 
                      className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin /> Location</h2>
                <p className="text-sm text-gray-400 mb-4">Please provide the address or nearby landmark.</p>
                <input 
                  type="text" 
                  className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                  placeholder="e.g. Near Inorbit Mall, Gorwa"
                  value={formData.location.address}
                  onChange={(e) => setFormData({...formData, location: { ...formData.location, address: e.target.value }})}
                  required
                />
                <div className="h-64 mt-4 bg-black bg-opacity-50 rounded-lg border border-gray-600 flex items-center justify-center text-gray-500">
                  [Google Maps Integration Placeholder]
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon /> Photo Evidence</h2>
                <p className="text-sm text-gray-400 mb-6">Upload up to 3 clear photos of the issue.</p>
                
                <div className="border-2 border-dashed border-[var(--color-secondary)] border-opacity-40 rounded-xl p-10 text-center hover:bg-[var(--color-secondary)] hover:bg-opacity-5 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                  <ImageIcon size={48} className="mx-auto text-[var(--color-secondary)] mb-4" />
                  <p className="text-lg font-medium text-white mb-1">Click or drag images here</p>
                  <p className="text-sm text-gray-400">JPG, PNG up to 10MB</p>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-6 flex gap-4">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-secondary)]">
                        <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Description & AI Analysis</h2>
                <p className="text-sm text-gray-400 mb-4">Provide detailed information. Our AI will analyze it to set priority.</p>
                
                <textarea 
                  className="w-full h-32 bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)] mb-4"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />

                <button 
                  type="button" 
                  onClick={analyzeDescription}
                  disabled={analyzing || !formData.description}
                  className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg border border-[var(--color-secondary)] hover:bg-opacity-80 transition flex justify-center items-center gap-2"
                >
                  {analyzing ? <Loader2 className="animate-spin" size={20} /> : '✨ Run AI Smart Analysis'}
                </button>

                {aiData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 border border-[var(--color-secondary)] bg-black bg-opacity-30 rounded-lg">
                    <h3 className="font-bold text-[var(--color-secondary)] mb-2">AI Insights</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div><span className="text-gray-500">Predicted Category:</span> {aiData.category}</div>
                      <div><span className="text-gray-500">Priority Level:</span> <span className="uppercase text-[var(--color-error)] font-bold">{aiData.priority}</span></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex justify-between border-t border-gray-700 pt-6">
            <button 
              type="button" 
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-0' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-2 rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent)] font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (step === 4 ? 'Submit Report' : 'Next Step')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;