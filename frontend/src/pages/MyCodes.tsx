import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight,
  Code,
  FileText,
  Hash,
  Calendar
} from 'lucide-react';
import type { Guide, Step } from '../types/codeGuides';

const MyCodeUploadsPage: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([
    {
      id: '1',
      created_at: '2024-06-15T10:30:00Z',
      title: 'React useState Hook Guide',
      description: 'A comprehensive guide to using React useState hook for state management',
      tags: ['react', 'hooks', 'state'],
      code_snippet: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  const increment = () => {\n    setCount(count + 1);\n  };\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>Increment</button>\n    </div>\n  );\n}\n\nexport default Counter;`,
      code_language: 'typescript',
      category: 'React',
      steps: [
        {
          id: 's1',
          guide_id: '1',
          step_number: 1,
          title: 'Import useState',
          description: 'Import the useState hook from React',
          start_line: 1,
          end_line: 1
        },
        {
          id: 's2',
          guide_id: '1',
          step_number: 2,
          title: 'Initialize state',
          description: 'Declare state variable with initial value',
          start_line: 4,
          end_line: 4
        },
        {
          id: 's3',
          guide_id: '1',
          step_number: 3,
          title: 'Create update function',
          description: 'Create a function to update the state',
          start_line: 6,
          end_line: 8
        }
      ]
    },
    {
      id: '2',
      created_at: '2024-06-14T14:20:00Z',
      title: 'TypeScript Interface Example',
      description: 'How to define and use TypeScript interfaces',
      tags: ['typescript', 'interfaces', 'types'],
      code_snippet: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'John Doe',\n  email: 'john@example.com',\n  isActive: true\n};`,
      code_language: 'typescript',
      category: 'TypeScript',
      steps: [
        {
          id: 's4',
          guide_id: '2',
          step_number: 1,
          title: 'Define interface',
          description: 'Create the interface structure',
          start_line: 1,
          end_line: 6
        },
        {
          id: 's5',
          guide_id: '2',
          step_number: 2,
          title: 'Use interface',
          description: 'Create an object using the interface',
          start_line: 8,
          end_line: 13
        }
      ]
    }
  ]);

  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());
  const [editingGuide, setEditingGuide] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guide>>({});
  const [stepForm, setStepForm] = useState<Partial<Step>>({});

  const toggleGuideExpansion = (guideId: string) => {
    const newExpanded = new Set(expandedGuides);
    if (newExpanded.has(guideId)) {
      newExpanded.delete(guideId);
    } else {
      newExpanded.add(guideId);
    }
    setExpandedGuides(newExpanded);
  };

  const startEditingGuide = (guide: Guide) => {
    setEditingGuide(guide.id || '');
    setEditForm(guide);
  };

  const startEditingStep = (step: Step) => {
    setEditingStep(step.id || '');
    setStepForm(step);
  };

  const saveGuide = () => {
    if (editingGuide) {
      setGuides(guides.map(guide => 
        guide.id === editingGuide 
          ? { ...guide, ...editForm }
          : guide
      ));
      setEditingGuide(null);
      setEditForm({});
    }
  };

  const saveStep = () => {
    if (editingStep) {
      setGuides(guides.map(guide => ({
        ...guide,
        steps: guide.steps?.map(step => 
          step.id === editingStep 
            ? { ...step, ...stepForm }
            : step
        )
      })));
      setEditingStep(null);
      setStepForm({});
    }
  };

  const deleteGuide = (guideId: string) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      setGuides(guides.filter(guide => guide.id !== guideId));
    }
  };

  const deleteStep = (stepId: string) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      setGuides(guides.map(guide => ({
        ...guide,
        steps: guide.steps?.filter(step => step.id !== stepId)
      })));
    }
  };

  const addNewStep = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId);
    const maxStepNumber = Math.max(0, ...(guide?.steps?.map(s => s.step_number) || []));
    
    const newStep: Step = {
      id: `step_${Date.now()}`,
      guide_id: guideId,
      step_number: maxStepNumber + 1,
      title: 'New Step',
      description: 'Step description',
      start_line: 1,
      end_line: 1
    };

    setGuides(guides.map(guide => 
      guide.id === guideId 
        ? { ...guide, steps: [...(guide.steps || []), newStep] }
        : guide
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Code Uploads</h1>
          <p className="text-gray-600">Manage your uploaded code guides and their steps</p>
        </div>

        {/* Guides List */}
        <div className="space-y-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Guide Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingGuide === guide.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="text-xl font-semibold w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Guide title"
                        />
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Guide description"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Category"
                          />
                          <input
                            type="text"
                            value={editForm.code_language || ''}
                            onChange={(e) => setEditForm({...editForm, code_language: e.target.value})}
                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Programming language"
                          />
                        </div>
                        <input
                          type="text"
                          value={editForm.tags?.join(', ') || ''}
                          onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(', ').filter(tag => tag.trim())})}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tags (comma separated)"
                        />
                        <textarea
                          value={editForm.code_snippet || ''}
                          onChange={(e) => setEditForm({...editForm, code_snippet: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          rows={8}
                          placeholder="Code snippet"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h2>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {guide.created_at && formatDate(guide.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Code className="w-4 h-4" />
                            {guide.code_language}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {guide.category}
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            {guide.steps?.length || 0} steps
                          </div>
                        </div>
                        {guide.tags && guide.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {guide.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {editingGuide === guide.id ? (
                      <>
                        <button
                          onClick={saveGuide}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Save changes"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingGuide(null);
                            setEditForm({});
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditingGuide(guide)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit guide"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteGuide(guide.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete guide"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleGuideExpansion(guide.id!)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title={expandedGuides.has(guide.id!) ? "Collapse" : "Expand"}
                        >
                          {expandedGuides.has(guide.id!) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedGuides.has(guide.id!) && (
                <div className="p-6 bg-gray-50">
                  {/* Code Snippet */}
                  {guide.code_snippet && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Code Snippet</h3>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{guide.code_snippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Steps */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Steps</h3>
                      <button
                        onClick={() => addNewStep(guide.id!)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Step
                      </button>
                    </div>

                    {guide.steps && guide.steps.length > 0 ? (
                      <div className="space-y-3">
                        {guide.steps
                          .sort((a, b) => a.step_number - b.step_number)
                          .map((step) => (
                          <div key={step.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            {editingStep === step.id ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                  <input
                                    type="number"
                                    value={stepForm.step_number || ''}
                                    onChange={(e) => setStepForm({...stepForm, step_number: parseInt(e.target.value)})}
                                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Step number"
                                  />
                                  <input
                                    type="number"
                                    value={stepForm.start_line || ''}
                                    onChange={(e) => setStepForm({...stepForm, start_line: parseInt(e.target.value)})}
                                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Start line"
                                  />
                                  <input
                                    type="number"
                                    value={stepForm.end_line || ''}
                                    onChange={(e) => setStepForm({...stepForm, end_line: parseInt(e.target.value)})}
                                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="End line"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={stepForm.title || ''}
                                  onChange={(e) => setStepForm({...stepForm, title: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Step title"
                                />
                                <textarea
                                  value={stepForm.description || ''}
                                  onChange={(e) => setStepForm({...stepForm, description: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={2}
                                  placeholder="Step description"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={saveStep}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingStep(null);
                                      setStepForm({});
                                    }}
                                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                      Step {step.step_number}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Lines {step.start_line}-{step.end_line}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                                  <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                                <div className="flex gap-1 ml-4">
                                  <button
                                    onClick={() => startEditingStep(step)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit step"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteStep(step.id!)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete step"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No steps added yet</p>
                        <p className="text-sm">Click "Add Step" to create the first step</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {guides.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No code guides yet</h3>
              <p className="text-gray-600">Upload your first code guide to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCodeUploadsPage;