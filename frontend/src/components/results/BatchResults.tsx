import React, { useState, useEffect } from 'react';
import { getBatch, getBatchReports, ReportBatch, StructuredReport } from '../../services/api';

interface BatchResultsProps {
  batchId: number;
}

const BatchResults: React.FC<BatchResultsProps> = ({ batchId }) => {
  const [batch, setBatch] = useState<ReportBatch | null>(null);
  const [reports, setReports] = useState<StructuredReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<StructuredReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchData, reportsData] = await Promise.all([
          getBatch(batchId),
          getBatchReports(batchId),
        ]);
        setBatch(batchData);
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching batch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Poll for updates if batch is still processing
    const interval = setInterval(async () => {
      if (batch?.status === 'processing' || batch?.status === 'pending') {
        const updatedBatch = await getBatch(batchId);
        setBatch(updatedBatch);
        
        const updatedReports = await getBatchReports(batchId);
        setReports(updatedReports);
        
        if (updatedBatch.status === 'completed') {
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [batchId, batch?.status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading batch results...</div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-red-600">Batch not found</div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStructuredData = (data: any) => {
    if (!data) return <p className="text-gray-500">No structured data available</p>;

    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border-b pb-3">
            <h4 className="font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </h4>
            {typeof value === 'object' && value !== null ? (
              <div className="ml-4 space-y-2">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey}>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {subKey.replace(/_/g, ' ')}:
                    </span>{' '}
                    <span className="text-sm text-gray-800">{String(subValue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-800 text-sm">{String(value)}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Batch Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{batch.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batch.status)}`}>
              {batch.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Reports</p>
            <p className="text-lg font-semibold">{batch.total_reports}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Processed</p>
            <p className="text-lg font-semibold">{batch.processed_reports}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Progress</p>
            <div className="mt-1">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all"
                  style={{
                    width: `${(batch.processed_reports / batch.total_reports) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm mt-1">
                {Math.round((batch.processed_reports / batch.total_reports) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Reports ({reports.length})</h3>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedReport?.id === report.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{report.filename || `Report #${report.id}`}</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                {report.confidence_score && (
                  <p className="text-xs text-gray-600">
                    Confidence: {report.confidence_score}%
                  </p>
                )}
                {report.error_message && (
                  <p className="text-xs text-red-600 mt-1">{report.error_message}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report Detail */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">
              {selectedReport ? 'Report Details' : 'Select a report to view details'}
            </h3>
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            {selectedReport ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Structured Data</h4>
                  {renderStructuredData(selectedReport.structured_data)}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Original Text</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
                    {selectedReport.original_text}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Click on a report to view its details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchResults;
