'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  User, 
  Loader2, 
  Trash2, 
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Feedback {
  _id: string;
  clientName: string;
  clientCompany: string;
  comment: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

const LeadsFeedback: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'feedback'>('leads');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [leadsRes, feedbackRes] = await Promise.all([
        axios.get('/api/meeting'),
        axios.get('/api/feedback')
      ]);
      setLeads(leadsRes.data);
      setFeedbacks(feedbackRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await axios.delete(`/api/meeting?id=${id}`);
      setLeads(leads.filter(l => l._id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const toggleFeedbackApproval = async (feedback: Feedback) => {
    try {
      const res = await axios.put(`/api/feedback?id=${feedback._id}`, {
        isApproved: !feedback.isApproved
      });
      setFeedbacks(feedbacks.map(f => f._id === feedback._id ? res.data : f));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await axios.delete(`/api/feedback?id=${id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Leads & Feedback</h2>
          <p className="text-zinc-400">Manage incoming inquiries and client testimonials.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === 'leads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveSubTab('feedback')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === 'feedback' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Feedback ({feedbacks.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'leads' ? (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700">
              <div 
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => setExpandedLead(expandedLead === lead._id ? null : lead._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-indigo-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{lead.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Mail size={14} />
                      <span>{lead.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-white">{lead.subject}</p>
                    <div className="flex items-center justify-end gap-1 text-xs text-zinc-500 mt-1">
                      <Calendar size={12} />
                      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    lead.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {lead.status}
                  </div>
                  {expandedLead === lead._id ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
                </div>
              </div>

              {expandedLead === lead._id && (
                <div className="px-6 pb-6 pt-2 border-t border-zinc-800 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-zinc-950 p-4 rounded-xl text-zinc-300 whitespace-pre-wrap mb-4 text-sm leading-relaxed">
                    {lead.message}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLead(lead._id); }}
                      className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete Inquiry</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {leads.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl">
              <Clock size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-500">No leads received yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 flex flex-col group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                    {feedback.clientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{feedback.clientName}</h4>
                    <p className="text-xs text-zinc-500">{feedback.clientCompany}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < feedback.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                  ))}
                </div>
              </div>
              
              <p className="text-zinc-400 text-sm italic leading-relaxed flex-1">
                &quot;{feedback.comment}&quot;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  onClick={() => toggleFeedbackApproval(feedback)}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    feedback.isApproved ? 'text-green-500' : 'text-zinc-500 hover:text-indigo-400'
                  }`}
                >
                  <CheckCircle size={14} />
                  <span>{feedback.isApproved ? 'Approved' : 'Approve'}</span>
                </button>
                <button
                  onClick={() => deleteFeedback(feedback._id)}
                  className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <div className="col-span-full text-center py-20 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl">
              <MessageSquare size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-500">No feedback submissions yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsFeedback;
