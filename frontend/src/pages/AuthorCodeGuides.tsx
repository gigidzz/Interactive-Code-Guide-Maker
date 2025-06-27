import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, BookOpen, Code, Calendar, MapPin } from 'lucide-react';
import { CodeGuideCard } from '../components/home-page/CodeGuideCard';
import { getCodeGuideByAuthorId } from '../api/codeGuides';
import type { CodeGuide } from '../types/codeGuides';

export const AuthorCodeGuides: React.FC = () => {
  const { 'author-id': authorId } = useParams<{ 'author-id': string }>();
  const [codeGuides, setCodeGuides] = useState<CodeGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState<CodeGuide['author'] | null>(null);

  useEffect(() => {
    const fetchCodeGuides = async () => {
      if (!authorId) {
        setError('Author ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const guides = await getCodeGuideByAuthorId(authorId);
        setCodeGuides(guides);
        
        // Extract author info from the first guide (assuming all guides have the same author)
        if (guides.length > 0 && guides[0].author) {
          setAuthor(guides[0].author);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch code guides');
        console.error('Error fetching code guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCodeGuides();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading code guides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800 p-8 rounded-xl border border-red-500/20">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Error Loading Code Guides</h2>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Author Header */}
        {author && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/20 p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">{author.name}</h1>
                <p className="text-slate-300 text-lg mb-4">{author.email}</p>
                
                {author.bio && (
                  <p className="text-slate-400 mb-4 leading-relaxed">{author.bio}</p>
                )}
                
                {author.profession && author.profession.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {author.profession.map((prof, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {prof}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="font-medium">{codeGuides.length}</span>
                    <span className="ml-1">Code Guide{codeGuides.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    <span>Author ID: {author.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Guides Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-slate-100">
              {author ? `${author.name}'s Code Guides` : 'Code Guides'}
            </h2>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {codeGuides.length}
            </span>
          </div>

          {codeGuides.length === 0 ? (
            <div className="text-center py-16">
              <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">No Code Guides Found</h3>
              <p className="text-slate-400">
                {author ? `${author.name} hasn't published any code guides yet.` : 'This author has no published code guides.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codeGuides.map((guide) => (
                <CodeGuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {codeGuides.length > 0 && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/20 p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Publishing Statistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{codeGuides.length}</div>
                <div className="text-sm text-slate-300">Total Guides</div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {new Set(codeGuides.map(g => g.code_language).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-300">Languages Used</div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {new Set(codeGuides.map(g => g.category).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-300">Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};