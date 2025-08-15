import { Component as ImageAutoSlider } from '@/components/ui/image-auto-slider';

const AutoGallerySection = () => {
  return (
    <section id="gallery" className="section-padding bg-gradient-section">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-headline text-primary mb-4">
            Every Detail Matters
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Explore the craftsmanship and precision that goes into every Curtain Luxe product.
          </p>
        </div>

        {/* Auto Slider */}
        <ImageAutoSlider />

        {/* Bottom Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full border border-blue-800" style={{ backgroundColor: 'rgb(31 41 55)' }}>
            <span className="text-sm font-medium text-white">
              Crafted with attention to every detail • #BuiltForComfort
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoGallerySection;