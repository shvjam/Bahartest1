import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    step.number < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.number === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm ${
                    step.number === currentStep
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                  step.number < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
