import React, { useState } from 'react';
import { createTemplate, Template } from '../../services/api';

interface TemplateDesignerProps {
  onTemplateCreated: (template: Template) => void;
}

interface TemplateField {
  name: string;
  type: 'text' | 'object';
  description: string;
  subfields?: TemplateField[];
}

const TemplateDesigner: React.FC<TemplateDesignerProps> = ({ onTemplateCreated }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addField = () => {
    setFields([
      ...fields,
      { name: '', type: 'text', description: '', subfields: [] },
    ]);
  };

  const updateField = (index: number, updates: Partial<TemplateField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addSubfield = (parentIndex: number) => {
    const newFields = [...fields];
    if (!newFields[parentIndex].subfields) {
      newFields[parentIndex].subfields = [];
    }
    newFields[parentIndex].subfields!.push({
      name: '',
      type: 'text',
      description: '',
    });
    setFields(newFields);
  };

  const updateSubfield = (
    parentIndex: number,
    subfieldIndex: number,
    updates: Partial<TemplateField>
  ) => {
    const newFields = [...fields];
    newFields[parentIndex].subfields![subfieldIndex] = {
      ...newFields[parentIndex].subfields![subfieldIndex],
      ...updates,
    };
    setFields(newFields);
  };

  const removeSubfield = (parentIndex: number, subfieldIndex: number) => {
    const newFields = [...fields];
    newFields[parentIndex].subfields = newFields[parentIndex].subfields!.filter(
      (_, i) => i !== subfieldIndex
    );
    setFields(newFields);
  };

  const buildStructure = () => {
    const structure: any = {};
    
    fields.forEach((field) => {
      if (field.name) {
        if (field.type === 'object' && field.subfields && field.subfields.length > 0) {
          structure[field.name] = {};
          field.subfields.forEach((subfield) => {
            if (subfield.name) {
              structure[field.name][subfield.name] = {
                type: subfield.type,
                description: subfield.description,
              };
            }
          });
        } else {
          structure[field.name] = {
            type: field.type,
            description: field.description,
          };
        }
      }
    });
    
    return structure;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateName || !templateType || fields.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const structure = buildStructure();
      const template = await createTemplate({
        name: templateName,
        description: templateDescription,
        template_type: templateType,
        structure,
        is_public: false,
      });
      
      onTemplateCreated(template);
      
      // Reset form
      setTemplateName('');
      setTemplateDescription('');
      setTemplateType('');
      setFields([]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Design Custom Template</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Template Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Template Name *</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Custom Chest CT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Brief description of this template"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Template Type *</label>
            <input
              type="text"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., custom_chest_ct"
            />
          </div>
        </div>

        {/* Template Fields */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Template Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Field
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Field name (e.g., clinical_indication)"
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(index, { type: e.target.value as 'text' | 'object' })
                    }
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="object">Object (with subfields)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={field.description}
                  onChange={(e) => updateField(index, { description: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description of this field"
                />

                {/* Subfields */}
                {field.type === 'object' && (
                  <div className="ml-6 space-y-2">
                    <button
                      type="button"
                      onClick={() => addSubfield(index)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Subfield
                    </button>
                    
                    {field.subfields?.map((subfield, subIndex) => (
                      <div key={subIndex} className="flex gap-2 items-start">
                        <input
                          type="text"
                          value={subfield.name}
                          onChange={(e) =>
                            updateSubfield(index, subIndex, { name: e.target.value })
                          }
                          className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Subfield name"
                        />
                        <input
                          type="text"
                          value={subfield.description}
                          onChange={(e) =>
                            updateSubfield(index, subIndex, { description: e.target.value })
                          }
                          className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubfield(index, subIndex)}
                          className="px-2 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Creating Template...' : 'Create Template'}
        </button>
      </form>
    </div>
  );
};

export default TemplateDesigner;
