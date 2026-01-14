
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircle, AlertTriangle, Clock, Activity, FileText, Database } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ORACLE_VERIFICATION: 'bg-blue-100 text-blue-800',
        ABM_ANALYSIS: 'bg-purple-100 text-purple-800',
        FRAUD_DETECTION: 'bg-orange-100 text-orange-800',
        CONSENSUS_SCORING: 'bg-indigo-100 text-indigo-800',
        ELIGIBLE: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default function AutonomousVerification() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pollStatus = async () => {
            try {
                // Use NEW Backend URL
                const res = await fetch(`http://localhost:3000/submissions/${id}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        pollStatus();
        const interval = setInterval(pollStatus, 3000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <Layout><div className="flex justify-center p-20">Loading status...</div></Layout>;
    if (!data) return <Layout><div className="text-center p-20">Submission not found</div></Layout>;

    const { submission, progress, eligibleAsset } = data;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b pb-6 border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Autonomous Verification</h1>
                        <p className="text-slate-500 mt-1 font-mono text-sm">ID: {submission.id}</p>
                    </div>
                    <StatusBadge status={submission.status} />
                </div>

                {eligibleAsset && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-green-900">Asset Approved & Registered</h3>
                                <p className="text-green-800 mt-1">
                                    Token ID: <span className="font-mono font-bold">{eligibleAsset.id}</span>
                                </p>
                                <p className="text-green-800 text-sm mt-2">
                                    Expected NAV: ₹{eligibleAsset.expectedNAV.mean.toLocaleString()} |
                                    Yield: {eligibleAsset.expectedYield.expected.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Oracle Logic */}
                    <div className={`p-6 rounded-xl border-2 ${progress.stages.oracleVerification?.completed ? 'border-green-500/20 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Oracle Truth Layer</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Existence</span>
                                <span className="font-mono font-bold">{progress.stages.oracleVerification?.subStages?.satellite?.score ? (progress.stages.oracleVerification.subStages.satellite.score * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ownership</span>
                                <span className="font-mono font-bold">{progress.stages.oracleVerification?.subStages?.ownership?.score ? (progress.stages.oracleVerification.subStages.ownership.score * 100).toFixed(0) : 0}%</span>
                            </div>
                        </div>
                    </div>

                    {/* ABM Logic */}
                    <div className={`p-6 rounded-xl border-2 ${progress.stages.abmAnalysis?.completed ? 'border-green-500/20 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-slate-900 dark:text-white">ABM Intelligence</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Market Fit</span>
                                <span className="font-mono font-bold">{progress.stages.abmAnalysis?.subStages?.marketIntelligence?.score ?? 0}/100</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Risk Score</span>
                                <span className="font-mono font-bold">{progress.stages.abmAnalysis?.subStages?.riskSimulation?.score ?? 0}/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 text-slate-300 rounded-xl p-6 font-mono text-xs h-64 overflow-y-auto">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> System Logs
                    </h3>
                    <div className="space-y-2">
                        {progress.logs.map((log: any, i: number) => (
                            <div key={i} className={`flex gap-3 ${log.level === 'error' ? 'text-red-400' : log.level === 'success' ? 'text-green-400' : 'text-slate-300'}`}>
                                <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span>{log.message}</span>
                            </div>
                        ))}
                        {progress.logs.length === 0 && <span className="opacity-50">Waiting for logs...</span>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
