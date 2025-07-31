'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import JournalForm from '@/components/JournalForm';
import JournalCard from '@/components/JournalCard';
import { useJournal } from '@/hooks/useJournal';
import { CreateJournalEntry } from '@/types';
import { AlertCircle, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { entries, loading, error, createEntry, generateImage, deleteEntry } = useJournal();
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateEntry = async (entry: CreateJournalEntry) => {
    setFormLoading(true);
    try {
      const newEntry = await createEntry(entry);
      console.log('Entry created successfully:', newEntry);
    } catch (error) {
      console.error('Failed to create entry:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGenerateImage = async (entryId: number) => {
    try {
      const updatedEntry = await generateImage(entryId);
      console.log('Image generated for entry:', updatedEntry);
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    try {
      await deleteEntry(entryId);
      console.log('Entry deleted successfully');
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Stats calculation
  const totalEntries = entries.length;
  const entriesWithImages = entries.filter(entry => entry.generated_image_url).length;
  const imageGenerationRate = totalEntries > 0 ? Math.round((entriesWithImages / totalEntries) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Welcome to Your AI Journal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your thoughts into visual stories. Write about your day, feelings, and experiences, 
            then watch AI create beautiful imagery that captures your emotional journey.
          </p>
        </div>

        {/* Quick Stats */}
        {totalEntries > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalEntries}</div>
              <div className="text-sm text-gray-600">Journal Entries</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <Sparkles className="w-8 h-8 text-secondary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{entriesWithImages}</div>
              <div className="text-sm text-gray-600">AI Images Generated</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{imageGenerationRate}%</div>
              <div className="text-sm text-gray-600">Visualization Rate</div>
            </div>
          </div>
        )}

        {/* Create Entry Form */}
        <JournalForm onSubmit={handleCreateEntry} loading={formLoading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Something went wrong</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Journal Entries Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800">Your Journal Entries</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}</span>
              {totalEntries > 0 && (
                <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                  {imageGenerationRate}% visualized
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && entries.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <BookOpen className="w-20 h-20 mx-auto mb-4" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">Start Your Journey</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Your journal is empty and ready for your first entry. Share your thoughts, feelings, 
                and experiences to begin your emotional wellness journey.
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 max-w-lg mx-auto">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-primary-800 font-medium text-sm mb-1">Pro Tip</p>
                    <p className="text-primary-700 text-sm">
                      After creating an entry, click "Generate Visual" to create an AI-powered 
                      image that represents your emotions and experiences!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Journal Entries Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <JournalCard
                    entry={entry}
                    onGenerateImage={handleGenerateImage}
                    onDelete={handleDeleteEntry}
                    loading={loading}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More / Pagination placeholder */}
          {entries.length > 0 && entries.length % 9 === 0 && (
            <div className="text-center py-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200">
                Load More Entries
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {totalEntries > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mt-12">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your Emotional Wellness Journey
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                You've created {totalEntries} journal {totalEntries === 1 ? 'entry' : 'entries'} and 
                generated {entriesWithImages} AI visualizations. Keep writing to track your emotional 
                patterns and maintain your mental wellness.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}