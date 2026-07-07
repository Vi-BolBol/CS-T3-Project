import { useCVBuilder } from '../../context/CVBuilderContext.jsx'

const steps = [
    { n: 1, label: "Photo"},
    { n: 2, label: "Personal"},
    { n: 3, label: "About"},
    { n: 4, label: "Experience"},
    { n: 5, label: "Preview"}
]

function StepProgressBar({currentStep}) {
    const { completedSteps } = useCVBuilder()

    return(
        <div className="w-full px-8 py-6">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.has(step.n)
                    const isCurrent = step.n === currentStep
                    const isPast = step.n < currentStep

                    return (
                        <div key={step.n} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`
                                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                                    ${(isCompleted || isPast || isCurrent)
                                        ? "bg-emerald-400 border-emerald-400 text-slate-900"
                                        : "bg-transparent border-slate-600 text-slate-500"
                                    }
                                `}>
                                    {(isCompleted || isPast) ? "✓" : step.n}
                                </div>
                                <span className={`
                                    text-xs font-medium
                                    ${(isCompleted || isPast || isCurrent) ? "text-emerald-400" : "text-slate-500"}
                                `}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`
                                    h-0.5 w-16 sm:w-24 mx-2 mb-6 transition-all
                                    ${step.n < currentStep ? "bg-emerald-400" : "bg-slate-700"}
                                `} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default StepProgressBar;
