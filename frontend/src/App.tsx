import React, { useState, useEffect } from 'react';
import UploadForm from './components/upload/UploadForm';
import BatchResults from './components/results/BatchResults';
import TemplateDesigner from './components/templates/TemplateDesigner';
import { getTemplates, getBatches, Template, ReportBatch } from './services/api';

type View = 'upload' | 'templates' | 'batches';

function App() {
  const [currentView, setCurrentView] = useState<View>('upload');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [batches, setBatches] = useState<ReportBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, batchesData] = await Promise.all([
        getTemplates(),
        getBatches(),
      ]);
      setTemplates(templatesData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (batchId: number) => {
    setSelectedBatchId(batchId);
    setCurrentView('batches');
    loadData();
  };

  const handleTemplateCreated = (template: Template) => {
    setTemplates([...templates, template]);
    setCurrentView('upload');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Radiology Report Structuring
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered radiology report extraction and structuring
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Reports
            </button>
            <button
              onClick={() => setCurrentView('batches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View Batches ({batches.length})
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Design Template
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'upload' && (
          <UploadForm templates={templates} onUploadComplete={handleUploadComplete} />
        )}
        
        {currentView === 'templates' && (
          <TemplateDesigner onTemplateCreated={handleTemplateCreated} />
        )}
        
        {currentView === 'batches' && (
          <div className="max-w-7xl mx-auto px-4">
            {batches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No batches yet. Upload some reports to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select a Batch</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        onClick={() => setSelectedBatchId(batch.id)}
                        className={`bg-white rounded-lg shadow p-4 cursor-pointer border-2 transition-colors ${
                          selectedBatchId === batch.id
                            ? 'border-blue-500'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-semibold mb-2">{batch.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Status: <span className="font-medium">{batch.status}</span></p>
                          <p>Reports: {batch.processed_reports}/{batch.total_reports}</p>
                          <p className="text-xs">{new Date(batch.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedBatchId && (
                  <BatchResults batchId={selectedBatchId} />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
