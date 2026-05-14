'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Save, Loader2, CheckCircle2, Globe, Share2, Eye } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface SectionStatus {
  sectionName: string;
  isActive: boolean;
}

interface SettingsData {
  siteName: string;
  socialLinks: SocialLink[];
  sectionsStatus: SectionStatus[];
}

const SettingsPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<SettingsData>({
    siteName: '',
    socialLinks: [],
    sectionsStatus: [
      { sectionName: 'Hero', isActive: true },
      { sectionName: 'About', isActive: true },
      { sectionName: 'Skills', isActive: true },
      { sectionName: 'Portfolio', isActive: true },
      { sectionName: 'Testimonials', isActive: true },
      { sectionName: 'Contact', isActive: true },
    ]
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data && res.data._id) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings', data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (index: number) => {
    const newStatus = [...data.sectionsStatus];
    newStatus[index].isActive = !newStatus[index].isActive;
    setData({ ...data, sectionsStatus: newStatus });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">General Settings</h2>
          <p className="text-zinc-400">Manage global site configuration and visibility.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
              <Globe size={20} />
              <h3>Site Identity</h3>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Site Name</label>
              <input
                type="text"
                value={data.siteName}
                onChange={(e) => setData({ ...data, siteName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50"
                placeholder="My Portfolio"
              />
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
              <Eye size={20} />
              <h3>Section Visibility</h3>
            </div>
            <div className="space-y-3">
              {data.sectionsStatus.map((section, index) => (
                <div key={section.sectionName} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-300 font-medium">{section.sectionName}</span>
                  <button
                    onClick={() => toggleSection(index)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                      section.isActive ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                      section.isActive ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 h-full">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
              <Share2 size={20} />
              <h3>Social Connections</h3>
            </div>
            <div className="space-y-4">
              {['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].map((platform) => {
                const existing = data.socialLinks.find(s => s.platform === platform);
                return (
                  <div key={platform} className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase font-bold">{platform}</label>
                    <input
                      type="url"
                      value={existing?.url || ''}
                      onChange={(e) => {
                        const newLinks = [...data.socialLinks];
                        const idx = newLinks.findIndex(s => s.platform === platform);
                        if (idx > -1) {
                          newLinks[idx].url = e.target.value;
                        } else {
                          newLinks.push({ platform, url: e.target.value });
                        }
                        setData({ ...data, socialLinks: newLinks });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500/50"
                      placeholder={`https://${platform.toLowerCase()}.com/username`}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
