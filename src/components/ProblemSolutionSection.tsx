import { ArrowRight, Clock, Smartphone, VolumeX, Settings } from 'lucide-react';

const problemSolutions = [
  {
    problem: "Miss the perfect timing?",
    solution: "Automated schedules that match sunrise and sunset.",
    icon: Clock,
    color: "from-orange-400 to-orange-600"
  },
  {
    problem: "Not at home?",
    solution: "Control anytime, anywhere via app or voice.",
    icon: Smartphone,
    color: "from-blue-400 to-blue-600"
  },
  {
    problem: "Tired of pulling and noisy movement?",
    solution: "Whisper-quiet motor with smooth glide.",
    icon: VolumeX,
    color: "from-green-400 to-green-600"
  },
  {
    problem: "Forget to adjust your curtains?",
    solution: "Custom scenes that do it for you.",
    icon: Settings,
    color: "from-purple-400 to-purple-600"
  }
];

const ProblemSolutionSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-width">
        <div className="text-center mb-20">
          <h2 className="text-headline text-black mb-6">
            Turn Everyday Hassles Into Instant Comfort
          </h2>
          <p className="text-body-large text-gray-600 max-w-3xl mx-auto">
            Problem → Solution — Experience the transformation from frustration to effortless living.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problemSolutions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-black" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    {/* Problem */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.problem}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center mb-4">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>

                    {/* Solution */}
                    <div>
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center px-8 py-4 bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="text-white font-semibold">
              Experience #BuiltForComfort Today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;