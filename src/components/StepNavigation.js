export default function StepNavigation({ step, onPrev, onNext, disableNext }) {
    return (
        <div className="flex justify-between mt-8">
            <button
                onClick={onPrev}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                disabled={step === 1}
            >
                ← Quay lại
            </button>
            <button
                onClick={onNext}
                disabled={disableNext}
                className={`px-6 py-2 rounded-lg text-white ${disableNext ? "bg-pink-200" : "bg-pink-500 hover:bg-pink-600"
                    }`}
            >
                Tiếp tục →
            </button>
        </div>
    );
}
