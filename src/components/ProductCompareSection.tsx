import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink } from 'lucide-react';
import heroSlidingImage from '@/assets/hero-sliding-curtain.jpg';
import heroRollerImage from '@/assets/hero-roller-curtain.jpg';

const comparisonData = [
  {
    feature: 'Look & Fit',
    sliding: 'Traditional curtain appearance, stacks to sides',
    roller: 'Minimal, modern aesthetic, rolls up completely'
  },
  {
    feature: 'Max Size',
    sliding: 'Up to 4.5m width × 3.5m height',
    roller: 'Up to 3.5m width × 3.0m height'
  },
  {
    feature: 'Noise Level',
    sliding: '< 35 dB (whisper quiet)',
    roller: '< 30 dB (virtually silent)'
  },
  {
    feature: 'Motor Power',
    sliding: '2.5 Nm torque, 15 rpm',
    roller: '1.8 Nm torque, 18 rpm'
  },
  {
    feature: 'Control Options',
    sliding: 'App, Voice, Scenes, Schedules',
    roller: 'App, Voice, Scenes, Schedules'
  },
  {
    feature: 'Installation',
    sliding: 'Ceiling or wall mount track',
    roller: 'Compact bracket system'
  },
  {
    feature: 'Best For',
    sliding: 'Living rooms, bedrooms, large windows',
    roller: 'Offices, modern homes, minimal spaces'
  }
];

const ProductCompareSection = () => {
  return (
    <section id="compare" className="section-padding bg-background">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-headline text-primary mb-4">
            Choose Your Style
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Both products deliver exceptional smart control. The choice comes down to your aesthetic preference and space requirements.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Sliding Card */}
          <div className="card-premium p-8 group hover:shadow-strong transition-all duration-500">
            <div className="aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden mb-6">
              <img
                src={heroSlidingImage}
                alt="Smart Sliding Curtain"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-title text-primary">Smart Sliding Curtain</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Traditional curtain elegance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Wide span coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Whisper-quiet operation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Flexible fabric options</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => {
                    const specsSection = document.getElementById('specs');
                    if (specsSection) {
                      specsSection.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => {
                        const slidingButton = specsSection.querySelector('button:first-of-type') as HTMLButtonElement;
                        if (slidingButton) slidingButton.click();
                      }, 500);
                    }
                  }}
                  className="btn-secondary"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Specs
                </Button>
                <Button 
                  onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-cta"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Roller Card */}
          <div className="card-premium p-8 group hover:shadow-strong transition-all duration-500">
            <div className="aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden mb-6">
              <img
                src={heroRollerImage}
                alt="Smart Roller Curtain"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-title text-primary">Smart Roller Curtain</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Minimal, modern design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Compact installation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Virtually silent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Precision control</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => {
                    const specsSection = document.getElementById('specs');
                    if (specsSection) {
                      specsSection.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => {
                        const rollerButton = specsSection.querySelector('button:last-of-type') as HTMLButtonElement;
                        if (rollerButton) rollerButton.click();
                      }, 500);
                    }
                  }}
                  className="btn-secondary"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Specs
                </Button>
                <Button 
                  onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-cta"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="card-minimal overflow-hidden">
          <div className="p-6 border-b border-border bg-surface">
            <h3 className="text-title text-primary text-center">
              Side-by-Side Comparison
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-primary w-1/3">Feature</th>
                  <th className="text-left p-4 font-semibold text-primary">Sliding Curtain</th>
                  <th className="text-left p-4 font-semibold text-primary">Roller Curtain</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0 hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-medium text-muted-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 text-foreground">
                      {row.sliding}
                    </td>
                    <td className="p-4 text-foreground">
                      {row.roller}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-border bg-surface/50">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-accent/20 text-accent-soft">
                  #BuiltForComfort
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Both products share the same premium smart features
                </span>
              </div>
              
              <Button 
                onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-cta"
              >
                Choose Your Style
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCompareSection;