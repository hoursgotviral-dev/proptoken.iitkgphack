import VerificationProgress from '@/components/verification/VerificationProgress';

export default function VerificationPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <VerificationProgress submissionId={params.id} />
        </main>
    );
}
