'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Loader2, CheckCircle2, Camera, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Skill {
  name: string;
  percentage: number;
}

interface ProfileData {
  name: string;
  headline: string;
  profileImage?: string;
  bioProblem: string;
  bioAgitate: string;
  bioSolution: string;
  skills: Skill[];
}

const ProfileEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<ProfileData>({
    name: '',
    headline: '',
    profileImage: '',
    bioProblem: '',
    bioAgitate: '',
    bioSolution: '',
    skills: []
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('/api/profile');
      if (res.data && res.data._id) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProfile();
  }, [fetchProfile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.9,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setData({ ...data, profileImage: reader.result as string });
          setCompressing(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
        setCompressing(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/profile', data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setData({
      ...data,
      skills: [...data.skills, { name: '', percentage: 0 }]
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = [...data.skills];
    newSkills.splice(index, 1);
    setData({ ...data, skills: newSkills });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData({ ...data, skills: newSkills });
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
          <h2 className="text-2xl font-bold text-white">Profile Editor</h2>
          <p className="text-zinc-400">Manage your public information and biography.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || compressing}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.2)]"
        >
          {saving || compressing ? <Loader2 size={18} className="animate-spin" /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : compressing ? 'Compressing...' : success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Image Upload */}
        <div className="md:col-span-2 flex flex-col items-center gap-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-indigo-500/50 transition-all duration-300">
              {data.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <Camera size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer shadow-lg transition-all duration-200">
              <Upload size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold">Profile Picture</h3>
            <p className="text-zinc-500 text-sm">Upload a professional headshot</p>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="SM Fahad Bin Mahbub"
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400">Headline</label>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            placeholder="Full Stack Developer & Designer"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400">Bio: Problem</label>
          <textarea
            value={data.bioProblem}
            onChange={(e) => setData({ ...data, bioProblem: e.target.value })}
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            placeholder="What problem do you solve?"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400">Bio: Agitate</label>
          <textarea
            value={data.bioAgitate}
            onChange={(e) => setData({ ...data, bioAgitate: e.target.value })}
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            placeholder="Why is this problem painful?"
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400">Bio: Solution</label>
          <textarea
            value={data.bioSolution}
            onChange={(e) => setData({ ...data, bioSolution: e.target.value })}
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            placeholder="How do you fix it?"
          />
        </div>

        <div className="md:col-span-2 space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Skills</h3>
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus size={18} />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 group">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-white focus:ring-0 placeholder-zinc-600 font-medium"
                    placeholder="Skill Name"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.percentage}
                      onChange={(e) => updateSkill(index, 'percentage', parseInt(e.target.value))}
                      className="flex-1 accent-indigo-500"
                    />
                    <span className="text-zinc-400 text-sm w-8">{skill.percentage}%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
