import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ChevronLeft, ChevronRight, Square, RotateCcw, Settings } from 'lucide-react';
import natureViewImage from '@/assets/nature-view.jpg';
import iphoneMockupImage from '@/assets/iphone-mockup.jpg';

const InteractiveDemoSection = () => {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [curtainType, setCurtainType] = useState<'sliding' | 'roller'>('sliding');

  const handleCurtainToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurtainOpen(!curtainOpen);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 1; }
        }
      `}</style>
      <section className="section-padding bg-background">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-headline text-primary mb-4">
            See It in Action — Control With Your Phone
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Experience the smooth, silent operation of Curtain Luxe. Click the app controls to see your curtains respond instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: 3D Window Demo */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[var(--radius-large)] overflow-hidden shadow-strong bg-surface border border-border">
              {/* Window Frame */}
              <div className="relative w-full h-full bg-transparent">
                {/* Window Frame Border */}
                <div className="absolute inset-0 border-8 border-white rounded-lg shadow-lg bg-transparent">
                </div>

                {/* Curtain Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {curtainType === 'sliding' ? (
                    <>
                      {/* Left Curtain Panel */}
                      <div 
                        className={`absolute top-8 left-8 transition-all duration-2000 ease-in-out ${
                          curtainOpen ? 'w-4 h-full' : 'w-1/2 h-full'
                        }`}
                        style={{
                          background: 'linear-gradient(90deg, #0A1D3A 0%, #0E2A52 10%, #1A3B6B 25%, #2A4F7F 40%, #1A3B6B 60%, #0E2A52 80%, #0A1D3A 100%)',
                          boxShadow: 'inset -6px 0 20px rgba(0,0,0,0.4), 8px 0 15px rgba(0,0,0,0.3), inset 3px 0 10px rgba(255,255,255,0.15)',
                          borderRadius: '0 8px 8px 0'
                        }}
                      >
                        {/* Luxurious Fabric Texture */}
                        <div className="absolute inset-0">
                          {/* Deep vertical pleats */}
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute h-full"
                              style={{ 
                                left: `${(i + 1) * 8}%`,
                                width: '3px',
                                background: `linear-gradient(180deg, 
                                  rgba(255,255,255,${0.2 + (i % 2) * 0.1}) 0%, 
                                  rgba(0,0,0,${0.3 + (i % 2) * 0.1}) 30%, 
                                  rgba(42,79,127,0.4) 50%, 
                                  rgba(0,0,0,${0.3 + (i % 2) * 0.1}) 70%, 
                                  rgba(255,255,255,${0.15 + (i % 2) * 0.05}) 100%)`,
                                boxShadow: `${i % 2 ? '2px' : '1px'} 0 4px rgba(0,0,0,0.4), inset 1px 0 2px rgba(255,255,255,0.2)`,
                                transform: `translateZ(${i % 2 ? '2px' : '1px'})`,
                                borderRadius: '1px'
                              }}
                            />
                          ))}
                          {/* Silk-like horizontal weave */}
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-full"
                              style={{ 
                                top: `${(i + 1) * 5}%`,
                                height: '1px',
                                background: `linear-gradient(90deg, 
                                  transparent 0%, 
                                  rgba(255,255,255,${0.1 + Math.sin(i * 0.5) * 0.05}) 15%, 
                                  rgba(42,79,127,0.3) 50%, 
                                  rgba(255,255,255,${0.1 + Math.sin(i * 0.5) * 0.05}) 85%, 
                                  transparent 100%)`,
                                opacity: 0.6
                              }}
                            />
                          ))}
                          {/* Shimmer effect */}
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                              animation: 'shimmer 4s ease-in-out infinite'
                            }}
                          />
                        </div>
                      </div>

                      {/* Right Curtain Panel */}
                      <div 
                        className={`absolute top-8 right-8 transition-all duration-2000 ease-in-out ${
                          curtainOpen ? 'w-4 h-full' : 'w-1/2 h-full'
                        }`}
                        style={{
                          background: 'linear-gradient(-90deg, #0A1D3A 0%, #0E2A52 10%, #1A3B6B 25%, #2A4F7F 40%, #1A3B6B 60%, #0E2A52 80%, #0A1D3A 100%)',
                          boxShadow: 'inset 6px 0 20px rgba(0,0,0,0.4), -8px 0 15px rgba(0,0,0,0.3), inset -3px 0 10px rgba(255,255,255,0.15)',
                          borderRadius: '8px 0 0 8px'
                        }}
                      >
                        {/* Luxurious Fabric Texture */}
                        <div className="absolute inset-0">
                          {/* Deep vertical pleats */}
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute h-full"
                              style={{ 
                                right: `${(i + 1) * 8}%`,
                                width: '3px',
                                background: `linear-gradient(180deg, 
                                  rgba(255,255,255,${0.2 + (i % 2) * 0.1}) 0%, 
                                  rgba(0,0,0,${0.3 + (i % 2) * 0.1}) 30%, 
                                  rgba(42,79,127,0.4) 50%, 
                                  rgba(0,0,0,${0.3 + (i % 2) * 0.1}) 70%, 
                                  rgba(255,255,255,${0.15 + (i % 2) * 0.05}) 100%)`,
                                boxShadow: `${i % 2 ? '-2px' : '-1px'} 0 4px rgba(0,0,0,0.4), inset -1px 0 2px rgba(255,255,255,0.2)`,
                                transform: `translateZ(${i % 2 ? '2px' : '1px'})`,
                                borderRadius: '1px'
                              }}
                            />
                          ))}
                          {/* Silk-like horizontal weave */}
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-full"
                              style={{ 
                                top: `${(i + 1) * 5}%`,
                                height: '1px',
                                background: `linear-gradient(-90deg, 
                                  transparent 0%, 
                                  rgba(255,255,255,${0.1 + Math.sin(i * 0.5) * 0.05}) 15%, 
                                  rgba(42,79,127,0.3) 50%, 
                                  rgba(255,255,255,${0.1 + Math.sin(i * 0.5) * 0.05}) 85%, 
                                  transparent 100%)`,
                                opacity: 0.6
                              }}
                            />
                          ))}
                          {/* Shimmer effect */}
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              background: 'linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                              animation: 'shimmer 4s ease-in-out infinite reverse'
                            }}
                          />
                        </div>
                      </div>

                      {/* Curtain Track */}
                      <div className="absolute top-8 left-8 right-8 h-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-700 rounded-full" />
                        <div className="absolute top-0.5 left-1 right-1 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Roller Curtain */}
                      <div 
                        className={`absolute top-8 left-8 right-8 transition-all duration-2000 ease-in-out ${
                          curtainOpen ? 'h-6' : 'h-full'
                        }`}
                        style={{
                          background: 'linear-gradient(180deg, #0A1D3A 0%, #1A3B6B 15%, #2A4F7F 30%, #3A5F8F 50%, #2A4F7F 70%, #1A3B6B 85%, #0A1D3A 100%)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.35), inset 0 3px 12px rgba(255,255,255,0.15), inset 0 -3px 12px rgba(0,0,0,0.25)',
                          borderRadius: '0 0 8px 8px'
                        }}
                      >
                        {/* Premium Fabric Texture */}
                        <div className="absolute inset-0">
                          {/* Refined vertical weave */}
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute h-full"
                              style={{ 
                                left: `${(i + 1) * 3.33}%`,
                                width: '1.5px',
                                background: `linear-gradient(180deg, 
                                  rgba(255,255,255,${0.15 + Math.sin(i * 0.3) * 0.05}) 0%, 
                                  rgba(0,0,0,${0.25 + Math.cos(i * 0.4) * 0.1}) 30%, 
                                  rgba(58,95,143,0.4) 50%, 
                                  rgba(0,0,0,${0.25 + Math.cos(i * 0.4) * 0.1}) 70%, 
                                  rgba(255,255,255,${0.1 + Math.sin(i * 0.3) * 0.03}) 100%)`,
                                opacity: 0.8,
                                borderRadius: '0.5px'
                              }}
                            />
                          ))}
                          {/* Elegant horizontal pattern */}
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-full"
                              style={{ 
                                top: `${(i + 1) * 4}%`,
                                height: '1px',
                                background: `linear-gradient(90deg, 
                                  rgba(255,255,255,0.05) 0%, 
                                  rgba(255,255,255,${0.15 + Math.sin(i * 0.6) * 0.05}) 25%, 
                                  rgba(58,95,143,0.3) 50%, 
                                  rgba(255,255,255,${0.15 + Math.sin(i * 0.6) * 0.05}) 75%, 
                                  rgba(255,255,255,0.05) 100%)`,
                                opacity: 0.7
                              }}
                            />
                          ))}
                          {/* Subtle shimmer */}
                          <div 
                            className="absolute inset-0 opacity-15"
                            style={{
                              background: 'linear-gradient(180deg, transparent 20%, rgba(255,255,255,0.1) 50%, transparent 80%)',
                              animation: 'shimmer 6s ease-in-out infinite'
                            }}
                          />
                        </div>
                      </div>

                      {/* Roller Track/Tube */}
                      <div className="absolute top-8 left-8 right-8 h-6 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-700 rounded-full" />
                        <div className="absolute top-1 left-2 right-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full" />
                        <div className="absolute top-3 left-2 right-2 h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
                      </div>
                    </>
                  )}
                </div>

                {/* Animation Indicator */}
                {isAnimating && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-accent-soft rounded-full animate-pulse" />
                      <span>{curtainOpen ? 'Opening...' : 'Closing...'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <Badge 
                variant={curtainOpen ? "default" : "secondary"}
                className={`${
                  curtainOpen 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                {curtainOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Right: iPhone Mockup */}
          <div className="relative">
            <div className="w-64 mx-auto">
              <div className="relative aspect-[9/19.5] rounded-[2.5rem] border-4 border-gray-900 bg-gray-900 shadow-2xl">
                {/* iPhone Screen */}
                <div className="w-full h-full bg-gradient-to-b from-[#0A1D3A] via-[#0C2347] to-[#0F2E5D] rounded-[2rem] overflow-hidden relative">
                  {/* Subtle lighting effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-transparent rounded-[2rem]" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-blue-300/10 blur-2xl rounded-full" />
                  
                  {/* Status Bar */}
                  <div className="h-8 flex items-center justify-between px-4 text-white text-sm font-medium relative z-10">
                    <span className="font-mono">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-2 border border-white/80 rounded-sm">
                        <div className="w-full h-full bg-white rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App Interface */}
                  <div className="flex-1 p-4 flex flex-col relative z-10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {/* App Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                        Smart Curtains
                      </h3>
                      <p className="text-sm text-blue-100/80 font-medium">Living Room</p>
                    </div>

                    {/* Curtain Visual */}
                    <div className="flex flex-col items-center justify-center mb-4">
                      <div className="relative w-32 h-32 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
                        {/* Frame effect */}
                        <div className="absolute inset-2 rounded-2xl bg-transparent overflow-hidden">
                          {/* Realistic curtain animation */}
                          {curtainType === 'sliding' ? (
                            <>
                              {/* Left curtain panel */}
                              <div 
                                className={`absolute top-0 left-0 h-full transition-all duration-2000 ease-in-out ${
                                  curtainOpen ? 'w-1' : 'w-1/2'
                                }`}
                                style={{
                                  background: 'linear-gradient(90deg, #0A1D3A 0%, #0C2347 20%, #0E2A52 50%, #0C2347 80%, #0A1D3A 100%)',
                                  boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.3), 2px 0 4px rgba(0,0,0,0.2), inset 1px 0 3px rgba(255,255,255,0.1)'
                                }}
                              >
                                {/* Fabric folds */}
                                <div className="absolute inset-0">
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="absolute h-full opacity-40" style={{ 
                                      left: `${(i + 1) * 16}%`,
                                      width: '1px',
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.1) 100%)'
                                    }} />
                                  ))}
                                </div>
                              </div>
                              
                              {/* Right curtain panel */}
                              <div 
                                className={`absolute top-0 right-0 h-full transition-all duration-2000 ease-in-out ${
                                  curtainOpen ? 'w-1' : 'w-1/2'
                                }`}
                                style={{
                                  background: 'linear-gradient(-90deg, #0A1D3A 0%, #0C2347 20%, #0E2A52 50%, #0C2347 80%, #0A1D3A 100%)',
                                  boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.3), -2px 0 4px rgba(0,0,0,0.2), inset -1px 0 3px rgba(255,255,255,0.1)'
                                }}
                              >
                                {/* Fabric folds */}
                                <div className="absolute inset-0">
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="absolute h-full opacity-40" style={{ 
                                      right: `${(i + 1) * 16}%`,
                                      width: '1px',
                                      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.1) 100%)'
                                    }} />
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            /* Roller curtain */
                            <div 
                              className={`absolute top-0 left-0 right-0 transition-all duration-2000 ease-in-out ${
                                curtainOpen ? 'h-2' : 'h-full'
                              }`}
                              style={{
                                background: 'linear-gradient(180deg, #0A1D3A 0%, #0C2347 25%, #0E2A52 50%, #0C2347 75%, #0A1D3A 100%)',
                                boxShadow: '0 3px 8px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,255,0.1), inset 0 -1px 4px rgba(0,0,0,0.2)'
                              }}
                            >
                              {/* Fabric texture */}
                              <div className="absolute inset-0">
                                {Array.from({ length: 15 }).map((_, i) => (
                                  <div key={i} className="absolute h-full opacity-30" style={{ 
                                    left: `${(i + 1) * 6.67}%`,
                                    width: '1px',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0.1) 100%)'
                                  }} />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Curtain track */}
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 shadow-md" />
                        </div>
                      </div>
                      
                      {/* Enhanced Percentage Indicator */}
                      <div className="mt-3">
                        <div className="bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/30 shadow-xl">
                          <span className="text-white text-lg font-bold tracking-wide">
                            {curtainOpen ? '100%' : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Curtain Type Selector */}
                    <div className="flex bg-white/10 rounded-xl p-1.5 mb-4 backdrop-blur-sm border border-white/20">
                      <button
                        onClick={() => setCurtainType('sliding')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          curtainType === 'sliding'
                            ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Sliding
                      </button>
                      <button
                        onClick={() => setCurtainType('roller')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          curtainType === 'roller'
                            ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Roller
                      </button>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-8 mb-2">
                      <button
                        onClick={() => !isAnimating && !curtainOpen && handleCurtainToggle()}
                        disabled={isAnimating || curtainOpen}
                        className="w-16 h-16 bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:from-blue-200/30 hover:to-blue-300/20 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {curtainType === 'sliding' ? (
                          <div className="flex items-center space-x-0.5">
                            <ChevronLeft className="w-4 h-4 text-white drop-shadow-lg" />
                            <ChevronRight className="w-4 h-4 text-white drop-shadow-lg" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-0.5">
                            <div className="w-5 h-0.5 bg-white rounded drop-shadow-lg" />
                            <ChevronRight className="w-4 h-4 text-white drop-shadow-lg rotate-90" />
                          </div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => !isAnimating && curtainOpen && handleCurtainToggle()}
                        disabled={isAnimating || !curtainOpen}
                        className="w-16 h-16 bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:from-blue-200/30 hover:to-blue-300/20 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {curtainType === 'sliding' ? (
                          <div className="flex items-center space-x-0.5">
                            <ChevronRight className="w-4 h-4 text-white drop-shadow-lg" />
                            <ChevronLeft className="w-4 h-4 text-white drop-shadow-lg" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-0.5">
                            <ChevronRight className="w-4 h-4 text-white drop-shadow-lg -rotate-90" />
                            <div className="w-5 h-0.5 bg-white rounded drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    </div>
                    
                    {/* Button Labels */}
                    <div className="flex justify-center gap-8">
                      <span className="text-sm text-white/90 text-center font-medium tracking-wide">Open</span>
                      <span className="text-sm text-white/90 text-center font-medium tracking-wide">Close</span>
                    </div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Interaction Hint */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                👆 Tap the app controls to see the magic
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-cta"
          >
            Experience This Control
          </Button>
        </div>
      </div>
      </section>
    </>
  );
};

export default InteractiveDemoSection;