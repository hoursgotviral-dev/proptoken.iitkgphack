import AssetSubmissionForm from '@/components/submission/AssetSubmissionForm';

export default function SubmitPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Asset Submission
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Provide details for the autonomous verification agents.
                    </p>
                </div>
                <AssetSubmissionForm />
            </div>
        </main>
    );
}
